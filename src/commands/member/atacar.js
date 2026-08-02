import { getPokemonAtual } from '../../pokemon/pokemonStructures.js'
import Jogador from '../../models/Jogador.js'
import { sendMessage } from '../../services/wapi.js'
import { firstLetterUpperCase } from '../../utils/commonFunctions.js'
import { calculateDamageMultiplier } from '../../pokemon/mappers/damageCalculator.js'
import { randomNumber } from '../../utils/commonFunctions.js'
import { currentPokemonSpawned } from '../../pokemon/pokemonSpawn.js'
import { setPokemonAtual } from '../../pokemon/pokemonStructures.js'
import { delay } from '../../utils/commonFunctions.js'

function getMoveCurrentPp(move) {
    return Number(move?.currentPp ?? move?.pp ?? move?.maxPp ?? 0)
}

function getRandomAvailableMove(moves) {
    const availableMoves = moves.filter(move => getMoveCurrentPp(move) > 0)

    if (!availableMoves.length) return null

    const randomIndex = randomNumber(0, availableMoves.length - 1)
    return availableMoves[randomIndex]
}

function decrementMovePp(move, amount = 1) {
    const currentPp = getMoveCurrentPp(move)
    const nextPp = Math.max(0, currentPp - Math.floor(Number(amount) || 0))

    if (Object.prototype.hasOwnProperty.call(move, 'currentPp')) {
        move.currentPp = nextPp
    }

    if (Object.prototype.hasOwnProperty.call(move, 'pp')) {
        move.pp = nextPp
    }

    return nextPp
}

function getStatValue(pokemon, statName) {
    if (!pokemon || typeof pokemon.getBattleStat !== 'function') return 0

    return Number(pokemon.getBattleStat(statName) ?? 0)
}

function calculateDamage(attacker, defender, move) {
    const attackStat = move.damageClass === 'special'
        ? getStatValue(attacker, 'specialAttack')
        : getStatValue(attacker, 'attack')

    const defenseStat = move.damageClass === 'special'
        ? getStatValue(defender, 'specialDefense')
        : getStatValue(defender, 'defense')

    const attackerLevel = Number(attacker?.getLevel?.() ?? 1)
    const power = Number(move.power ?? 0)
    const safeDefense = Math.max(1, defenseStat)
    const attackerTypes = Array.isArray(attacker?.types)
        ? attacker.types.map(type => String(type ?? '').toLowerCase())
        : []
    const stabMultiplier = attackerTypes.includes(move.type) ? 1.5 : 1
    const typeMultiplier = calculateDamageMultiplier(
        move.type,
        defender.types?.[0] ?? null,
        defender.types?.[1] ?? null
    )
    const randomMultiplier = randomNumber(85, 100) / 100

    if (typeMultiplier <= 0) {
        return {
            damage: 0,
            typeMultiplier
        }
    }

    const baseDamage = Math.floor(
        (((2 * attackerLevel) / 5 + 2) * power * (attackStat / safeDefense)) / 50
    ) + 2

    return {
        damage: Math.max(1, Math.floor(baseDamage * stabMultiplier * typeMultiplier * randomMultiplier)),
        typeMultiplier
    }
}

function formatMultiplier(multiplier) {
    const parsedMultiplier = Number(multiplier ?? 1)

    if (!Number.isFinite(parsedMultiplier)) return '1x'

    const rounded = Math.round(parsedMultiplier * 100) / 100
    const isInteger = Number.isInteger(rounded)

    return isInteger ? `${rounded}x` : `${rounded.toFixed(2).replace(/\.00$/, '').replace(/0$/, '')}x`
}

function formatHp(currentHp, maxHp) {
    return `${Math.max(0, Number(currentHp ?? 0))}/${Math.max(0, Number(maxHp ?? 0))}`
}

function getSideIcon(side) {
    return side === 'player' ? '👤' : '🤖'
}

function getSideLabel(side) {
    return side === 'player' ? '👤' : '🤖 Pokemon Selvagem'
}

export default {
    name: 'atacar',
    description: 'Tenta atacar o pokémon spawnado',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)
        const currentComputerPokemon = await getPokemonAtual()

        if (!currentPlayer)
            return await sendMessage(groupId, '⚠️ Você precisa se registrar primeiro usando o comando !registrar *seu nick*')

        if (!currentComputerPokemon)
            return await sendMessage(groupId, '❌ Nenhum Pokémon está spawnado no momento.')

        const partnerPokemonId = await currentPlayer.getPartnerPokemonId()

        if (!partnerPokemonId) {
            return await sendMessage(groupId, '❌ Você não tem um Pokémon parceiro definido.')
        }

        const partnerPokemon = await currentPlayer.getPokemonById(partnerPokemonId)

        if (!partnerPokemon)
            return await sendMessage(groupId, '❌ Não foi possível carregar o seu Pokémon parceiro.')

        if (partnerPokemon.getCurrentHp() <= 0) {
            return await sendMessage(groupId, '❌ Seu Pokémon parceiro está desmaiado.')
        }

        const playerPokemonMoves = partnerPokemon.getMoves()
        const computerPokemonMoves = currentComputerPokemon.getMoves()

        const playerRandomMove = getRandomAvailableMove(playerPokemonMoves)
        const computerRandomMove = getRandomAvailableMove(computerPokemonMoves)

        if (!playerRandomMove)
            return await sendMessage(groupId, `❌ O seu pokémon *${firstLetterUpperCase(partnerPokemon.getName())}* não tem movimentos com PP disponível.`)

        if (!computerRandomMove)
            return await sendMessage(groupId, `❌ O pokémon spawnado *${firstLetterUpperCase(currentComputerPokemon.getName())}* não tem movimentos com PP disponível.`)

        const playerPokemonSpeed = partnerPokemon.getBattleSpeed()
        const computerPokemonSpeed = currentComputerPokemon.getBattleSpeed()

        const attackerFirst = playerPokemonSpeed > computerPokemonSpeed
            ? 'player'
            : computerPokemonSpeed > playerPokemonSpeed
                ? 'computer'
                : (randomNumber(0, 1) === 0 ? 'player' : 'computer')

        const resolveAttack = async (attacker, defender, move, attackerPokemon = null, attackerSide = 'computer') => {
            const defenderSide = attackerSide === 'player' ? 'computer' : 'player'
            const attackerIcon = getSideIcon(attackerSide)
            const defenderIcon = getSideIcon(defenderSide)
            const accuracyRoll = randomNumber(1, 100)

            if (attackerPokemon) {
                await attackerPokemon.spendMovePp(move.name, 1)
            } else {
                decrementMovePp(move, 1)
            }

            if (accuracyRoll > move.accuracy) {
                battleLog.push(`❌ ${attackerIcon} usou *${firstLetterUpperCase(move.name)}* e errou!`)
                return 0
            }

            const { damage, typeMultiplier } = calculateDamage(attacker, defender, move)
            const defenderCurrentHp = Number(defender.getCurrentHp?.() ?? defender.currentHp ?? 0)
            const nextHp = Math.max(0, defenderCurrentHp - damage)

            if (typeof defender.setCurrentHp === 'function') {
                await defender.setCurrentHp(nextHp)
            } else {
                defender.currentHp = nextHp
            }

            return {
                damage,
                typeMultiplier,
                nextHp,
                attackerIcon,
                defenderIcon
            }
        }

        const playerCurrentHp = Number(partnerPokemon.getCurrentHp() ?? partnerPokemon.currentHp ?? 0)
        const computerCurrentHp = Number(currentComputerPokemon.getCurrentHp?.() ?? currentComputerPokemon.currentHp ?? 0)
        const playerMaxHp = Number(partnerPokemon.getMaxHp?.() ?? partnerPokemon.getBattleHp?.() ?? 0)
        const computerMaxHp = Number(currentComputerPokemon.getMaxHp?.() ?? currentComputerPokemon.getBattleHp?.() ?? 0)

        const initialMessage = [
            `🎯 Batalha de ${currentPlayer.getName()}!`,
            ``,
            `👤 ${firstLetterUpperCase(partnerPokemon.getName())} HP: ${formatHp(playerCurrentHp, playerMaxHp)}`,
            `Movimento: *${firstLetterUpperCase(playerRandomMove.name)}*`,
            ``,
            `🤖 Pokemon Selvagem HP: ${formatHp(computerCurrentHp, computerMaxHp)}`,
            `Movimento: *${firstLetterUpperCase(computerRandomMove.name)}*`
        ].join('\n')

        await sendMessage(groupId, initialMessage)
        await delay(1500)

        const playerFirst = attackerFirst === 'player'
        const firstAttacker = playerFirst
            ? {
                side: 'player',
                attacker: partnerPokemon,
                defender: currentComputerPokemon,
                move: playerRandomMove,
                pokemonInstance: partnerPokemon
            }
            : {
                side: 'computer',
                attacker: currentComputerPokemon,
                defender: partnerPokemon,
                move: computerRandomMove,
                pokemonInstance: null
            }

        const secondAttacker = playerFirst
            ? {
                side: 'computer',
                attacker: currentComputerPokemon,
                defender: partnerPokemon,
                move: computerRandomMove,
                pokemonInstance: null
            }
            : {
                side: 'player',
                attacker: partnerPokemon,
                defender: currentComputerPokemon,
                move: playerRandomMove,
                pokemonInstance: partnerPokemon
            }

        const firstAttackResult = await resolveAttack(
            firstAttacker.attacker,
            firstAttacker.defender,
            firstAttacker.move,
            firstAttacker.pokemonInstance,
            firstAttacker.side
        )

        await sendMessage(
            groupId,
            `⚔️ ${firstAttacker.side === 'player' ? firstAttacker.attacker.getName() : 'Pokemon Selvagem'} usou ${firstLetterUpperCase(firstAttacker.move.name)} (${formatMultiplier(firstAttackResult.typeMultiplier)}) e causou ${firstAttackResult.damage} de dano no ${firstAttacker.side === 'player' ? 'pokemon selvagem' : 'jogador'}.`
        )

        const firstDefenderIsComputer = firstAttacker.side === 'player'
        const firstDefenderCurrentHp = firstDefenderIsComputer
            ? Number(currentComputerPokemon.getCurrentHp?.() ?? currentComputerPokemon.currentHp ?? 0)
            : Number(partnerPokemon.getCurrentHp() ?? partnerPokemon.currentHp ?? 0)

        if (firstDefenderCurrentHp <= 0) {
            const defeatedPokemonName = firstDefenderIsComputer
                ? firstLetterUpperCase(currentComputerPokemon.name)
                : firstLetterUpperCase(partnerPokemon.getName())
            const winnerPokemonName = firstDefenderIsComputer
                ? firstLetterUpperCase(partnerPokemon.getName())
                : 'Pokemon Selvagem'
            const winnerPokemon = firstDefenderIsComputer ? partnerPokemon : currentComputerPokemon
            const earnedExp = firstDefenderIsComputer
                ? Math.max(10, Math.floor(currentComputerPokemon.getLevel() * 20 + currentComputerPokemon.getBattleHp() / 4))
                : 0

            if (firstDefenderIsComputer) {
                await winnerPokemon.addExperience(earnedExp)
                currentPokemonSpawned.alreadyCaught = true
                currentPokemonSpawned.number = null
                setPokemonAtual(null)
            }

            const defeatMessage = firstDefenderIsComputer
                ? `💥 ${defeatedPokemonName} desmaiou.\n\n🌟 ${winnerPokemonName} ganhou *${earnedExp} XP*.`
                : `💥 ${defeatedPokemonName} desmaiou.`

            await sendMessage(groupId, defeatMessage)
            return
        }

        const secondAttackResult = await resolveAttack(
            secondAttacker.attacker,
            secondAttacker.defender,
            secondAttacker.move,
            secondAttacker.pokemonInstance,
            secondAttacker.side
        )

        await sendMessage(
            groupId,
            `⚔️ ${secondAttacker.side === 'player' ? secondAttacker.attacker.getName() : 'Pokemon Selvagem'} usou ${firstLetterUpperCase(secondAttacker.move.name)} (${formatMultiplier(secondAttackResult.typeMultiplier)}) e causou ${secondAttackResult.damage} de dano no ${secondAttacker.side === 'player' ? 'pokemon selvagem' : 'jogador'}.`
        )

        const playerRemainingHp = Number(partnerPokemon.getCurrentHp() ?? partnerPokemon.currentHp ?? 0)
        const computerRemainingHp = Number(currentComputerPokemon.getCurrentHp?.() ?? currentComputerPokemon.currentHp ?? 0)

        if (computerRemainingHp <= 0) {
            const earnedExp = Math.max(10, Math.floor(currentComputerPokemon.getLevel() * 20 + currentComputerPokemon.getBattleHp() / 4))
            await partnerPokemon.addExperience(earnedExp)
            currentPokemonSpawned.alreadyCaught = true
            currentPokemonSpawned.number = null
            setPokemonAtual(null)

            await sendMessage(
                groupId,
                `💥 ${firstLetterUpperCase(currentComputerPokemon.name())} desmaiou.\n\n🌟 ${firstLetterUpperCase(partnerPokemon.getName())} ganhou *${earnedExp} XP*.`
            )
        }

    }
}
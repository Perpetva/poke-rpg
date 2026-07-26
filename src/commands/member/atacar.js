import { getPokemonAtual } from '../../pokemon/pokemonStructures.js'
import Jogador from '../../models/Jogador.js'
import { sendMessage } from '../../services/wapi.js'
import { firstLetterUpperCase } from '../../utils/commonFunctions.js'
import { calculateDamageMultiplier } from '../../pokemon/mappers/damageCalculator.js'
import { randomNumber } from '../../utils/commonFunctions.js'
import { currentPokemonSpawned } from '../../pokemon/pokemonSpawn.js'
import { setPokemonAtual } from '../../pokemon/pokemonStructures.js'

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

        const battleLog = []

        const resolveAttack = async (attacker, defender, move, attackerPokemon = null) => {
            const attackerName = firstLetterUpperCase(attacker.getName())
            const defenderName = firstLetterUpperCase(defender.getName())
            const accuracyRoll = randomNumber(1, 100)

            if (attackerPokemon) {
                await attackerPokemon.spendMovePp(move.name, 1)
            } else {
                decrementMovePp(move, 1)
            }

            if (accuracyRoll > move.accuracy) {
                battleLog.push(`❌ ${attackerName} usou *${firstLetterUpperCase(move.name)}* e errou!`)
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

            battleLog.push(
                `⚔️ ${attackerName} usou *${firstLetterUpperCase(move.name)} (${formatMultiplier(typeMultiplier)})* em ${defenderName} e causou *${damage}* de dano.`
            )

            if (nextHp <= 0) {
                battleLog.push(`💥 ${defenderName} desmaiou.`)
            }

            return damage
        }

        const playerFirst = attackerFirst === 'player'

        if (playerFirst) {
            await resolveAttack(partnerPokemon, currentComputerPokemon, playerRandomMove, partnerPokemon)
            await resolveAttack(currentComputerPokemon, partnerPokemon, computerRandomMove)
        } else {
            await resolveAttack(currentComputerPokemon, partnerPokemon, computerRandomMove)
            await resolveAttack(partnerPokemon, currentComputerPokemon, playerRandomMove, partnerPokemon)
        }

        const playerRemainingHp = Number(partnerPokemon.getCurrentHp() ?? partnerPokemon.currentHp ?? 0)
        const computerRemainingHp = Number(currentComputerPokemon.getCurrentHp?.() ?? currentComputerPokemon.currentHp ?? 0)

        let xpMessage = ''

        if (computerRemainingHp <= 0) {
            const earnedExp = Math.max(10, Math.floor(currentComputerPokemon.getLevel() * 20 + currentComputerPokemon.getBattleHp() / 4))
            await partnerPokemon.addExperience(earnedExp)
            currentPokemonSpawned.alreadyCaught = true
            currentPokemonSpawned.number = null
            setPokemonAtual(null)
            xpMessage = `\n\n🌟 ${firstLetterUpperCase(partnerPokemon.getName())} ganhou *${earnedExp} XP*.`
        }

        const resultMessage = [
            `🎯 Turno de ${currentPlayer.getName()}!`,
            `\nSeu Pokémon: *${firstLetterUpperCase(partnerPokemon.getName())}*`,
            `HP: ${playerRemainingHp}`,
            `Movimento: *${firstLetterUpperCase(playerRandomMove.name)}*`,
            `\nPokémon spawnado: *${firstLetterUpperCase(currentComputerPokemon.getName())}*`,
            `HP: ${Math.max(0, computerRemainingHp)}`,
            `Movimento: *${firstLetterUpperCase(computerRandomMove.name)}*`,
            `\n${battleLog.join('\n')}`,
            xpMessage,
            computerRemainingHp <= 0 ? `\n✅ O pokémon spawnado foi derrotado..` : ''
        ].join('\n')

        return await sendMessage(groupId, resultMessage.trim())

    }
}
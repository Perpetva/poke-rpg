import { getPokemonAtual } from '../../pokemon/pokemonStructures.js'
import { currentPokemonSpawned } from '../../pokemon/pokemonSpawn.js'
import { isOnCooldown, setCooldown, getRemainingTime } from '../../pokemon/cooldowns.js'
import Jogador from '../../models/Jogador.js'
import { sendMessage } from '../../services/wapi.js'
import { getHeightAndWeightById, getPokemonTypesById, translatePokemonTypes, verifyGenerationById } from '../../pokemon/commonPokemonFunctions.js'
import { send } from 'process'

export default {
    name: 'pegar',
    description: 'Tenta capturar o pokémon spawnado',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)
        const currentPokemon = getPokemonAtual()

        if (!currentPlayer)
            return await sendMessage(groupId, '⚠️ Você precisa se registrar primeiro usando o comando !registrar *seu nick*')

        if (!currentPokemon)
            return await sendMessage(groupId, '❌ Nenhum Pokémon está spawnado no momento.')

        if (currentPlayer.getPokebola() <= 0)
            return await sendMessage(groupId, '⚠️ Você não tem mais pokebolas!')

        const typedPokemonName = args[0] ? args[0].toLowerCase() : ''

        if (currentPokemonSpawned.alreadyCaught === true) {
            if (typedPokemonName === currentPokemon.name.toLowerCase())
                return await sendMessage(groupId, `O pokemon ${currentPokemon.name} já foi pego ou morto.`)

            return await sendMessage(groupId, `O pokemon ${currentPokemon.name} já foi pego e além disso você digitou o nome errado!`)
        }

        if (isOnCooldown(userPhone)) {
            const seconds = getRemainingTime(userPhone)
            return await sendMessage(groupId, `⏳ Espere ${seconds} segundos antes de tentar pegar outro Pokémon.`)
        }

        if (typedPokemonName === currentPokemon.name.toLowerCase()) {
            const existingPokemon = await currentPlayer.getPokemonByName(currentPokemon.name)
            if (existingPokemon) {
                return await sendMessage(groupId, 
                    `❌ Você já possui um ${currentPokemon.name}! Não é possível capturar outro Pokémon com o mesmo nome.`
                )
            }

            if (await currentPokemon.escapePokemonChance()) {
                setCooldown(userPhone, 120000)
                await currentPlayer.updateItem('pokebola', -1)
                return await sendMessage(groupId, `${currentPlayer.getName()}, o Pokémon ${currentPokemon.name} escapou! 😢 Você poderá tentar novamente em 2 minutos.`)
            }

            currentPokemonSpawned.alreadyCaught = true
            const savePokemonCapitured = await currentPlayer.capturePokemon(currentPokemon)

            if (!savePokemonCapitured) {
                return await sendMessage(groupId, '❌ Erro ao capturar o pokémon ( _banco de dados_ ).' )
            }

            await currentPlayer.updateItem('pokebola', -1)
            const pokemonSpecieId = currentPokemon.specieId

            const { height, weight } = await getHeightAndWeightById(pokemonSpecieId)
            const types = await getPokemonTypesById(pokemonSpecieId)
            const translatedTypes = translatePokemonTypes(types)
            const generation = verifyGenerationById(pokemonSpecieId)

            return await sendMessage(groupId, 
                `Parabéns ${currentPlayer.getName()}! Você pegou o pokemon *${currentPokemon.name}*!\n\n` +
                `_ID:_ ${pokemonSpecieId}\n` +
                `_Tipo(s):_ ${translatedTypes || 'desconhecido'}\n` +
                `_Altura:_ ${height ?? 'desconhecida'}m\n` +
                `_Peso:_ ${weight ?? 'desconhecido'}kg\n` +
                `_Geração:_ ${generation}\n\n` +
                `Você pode ver mais detalhes do seu pokemon com o comando !poke ${currentPokemon.name}.\n` +

                `_Você tem *${currentPlayer.getPokebola()}* pokebolas restantes._`
            )
        }

        return await sendMessage(groupId, `Esse não é o pokemon spawnado! 💔`)
    }
}
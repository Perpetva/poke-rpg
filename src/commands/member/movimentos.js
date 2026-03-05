import { sendMessage } from '../../services/wapi.js'
import Jogador from '../../models/Jogador.js'
import { translatePokemonTypes } from '../../pokemon/commonPokemonFunctions.js'
import { firstLetterUpperCase } from '../../utils/commonFunctions.js'

export default {
    name: 'movimentos',
    description: 'Exibe os movimentos dos pokemons',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)
        const pokemonName = args[0]?.trim()

        if (!currentPlayer)
            return await sendMessage(groupId, '⚠️ Você precisa se registrar primeiro usando o comando !registrar *seu nick*')

        if (!pokemonName)
            return await sendMessage(groupId, 'Por favor, forneça o nome do pokemon! Exemplo: !movimentos pikachu')

        const currentPokemon = await currentPlayer.getPokemonByName(pokemonName)

        if (!currentPokemon)
            return await sendMessage(groupId, `❌ Você não possui um pokemon com o nome ${pokemonName}!`)

        const pokemonMoves = currentPokemon.getMoves()

        if (!pokemonMoves.length)
            return await sendMessage(groupId, `⚠️ O pokémon *${firstLetterUpperCase(currentPokemon.getName())}* não possui movimentos cadastrados.`)

        const movesList = pokemonMoves
            .map(move => ` ₪ *${firstLetterUpperCase(move.getName())}* ₪\nPP: ${move.getCurrentPp()}/${move.getMaxPp()}\nDano: ${move.getPower()}\nPrecisão: ${move.getAccuracy()}\nTipo: ${translatePokemonTypes([move.getType()])}\n`)
            .join('\n\n')

        const info = `📘 Movimentos de *${firstLetterUpperCase(currentPokemon.getName())}*\nDono: ${currentPlayer.getName()}\n\n${movesList}`

        return await sendMessage(groupId, info)
    }
}
import Jogador from "../../models/Jogador.js"
import { sendMessage } from "../../services/wapi.js"
import { firstLetterUpperCase } from "../../utils/commonFunctions.js"

export default {
    name: 'reviver',
    description: 'revive o pokémon do jogador',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)
        const pokemonName = args[0]?.trim()
    
        if (!currentPlayer)
            return await sendMessage(groupId, '⚠️ Você precisa se registrar primeiro usando o comando !registrar *seu nick*')

        if (!pokemonName)
            return await sendMessage(groupId, '⚠️ Você precisa especificar o nome do pokémon que deseja reviver')

        const currentPokemon = await currentPlayer.getPokemonByName(pokemonName)

        if (!currentPokemon)
            return await sendMessage(groupId, `❌ Você não possui um pokémon com o nome ${firstLetterUpperCase(pokemonName)}!`)

        if (currentPokemon.getCurrentHp() >= 1)
            return await sendMessage(groupId, `⚠️ O pokémon ${firstLetterUpperCase(pokemonName)} não está morto!`)

        if (currentPlayer.getReviver() <= 0)
            return await sendMessage(groupId, '⚠️ Você não possui reviver para reviver seu pokémon!')

        await currentPlayer.updateItem("reviver", -1)
        await currentPokemon.revive()
        await sendMessage(groupId, `✅ O pokémon ${firstLetterUpperCase(pokemonName)} foi revivido!`)

    }
}
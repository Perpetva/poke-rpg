import Jogador from "../../models/Jogador.js"
import { sendMessage } from "../../services/wapi.js"
import { firstLetterUpperCase } from "../../utils/commonFunctions.js"

export default {
    name: 'pocao',
    description: 'Cura o pokémon do jogador usando uma poção',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)
        const pokemonName = args[0]?.trim()
    
        if (!currentPlayer)
            return await sendMessage(groupId, '⚠️ Você precisa se registrar primeiro usando o comando !registrar *seu nick*')

        if (!pokemonName)
            return await sendMessage(groupId, '⚠️ Você precisa especificar o nome do pokémon que deseja curar')

        const currentPokemon = await currentPlayer.getPokemonByName(pokemonName)

        if (!currentPokemon)
            return await sendMessage(groupId, `❌ Você não possui um pokémon com o nome ${firstLetterUpperCase(pokemonName)}!`)

        if (currentPokemon.getCurrentHp() === currentPokemon.getMaxHp())
            return await sendMessage(groupId, `⚠️ O pokémon ${firstLetterUpperCase(pokemonName)} já está com a vida cheia!`)

        if (currentPlayer.getPocao() <= 0)
            return await sendMessage(groupId, '⚠️ Você não possui poções para curar seu pokémon!')

        if (currentPokemon.getCurrentHp() <= 0)
            return await sendMessage(groupId, `❌ O pokémon ${firstLetterUpperCase(pokemonName)} está desmaiado!, use !reviver para trazê-lo de volta!`)

        await currentPlayer.updateItem("pocao", -1)
        await currentPokemon.heal()
        await sendMessage(groupId, `✅ O pokémon ${firstLetterUpperCase(pokemonName)} foi curado, agora ele possuí ${currentPokemon.getCurrentHp()}/${currentPokemon.getMaxHp()} de vida!`)
    }
}
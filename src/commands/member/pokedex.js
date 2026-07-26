import Jogador from "../../models/Jogador.js"
import { sendMessage } from "../../services/wapi.js"
import { firstLetterUpperCase } from "../../utils/commonFunctions.js"

export default {
    name: 'pokedex',
    description: 'Mostra os pokemons capturados pelo jogador',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)
        
        if (!currentPlayer)
            return await sendMessage(groupId, '⚠️ Você precisa se registrar primeiro usando o comando !registrar *seu nick*')

        const capturedPokemons = await currentPlayer.getPokedex()

        if (!capturedPokemons || capturedPokemons.length === 0) 
            return await sendMessage(groupId, '❌ Você não tem nenhum Pokémon na Pokédex.')

        const formatedCapturedPokemons = capturedPokemons
            .map(p => `- ${firstLetterUpperCase(p.name)} `)
            .join('\n');

        return await sendMessage(groupId, `Olá ${currentPlayer.getName()}! Abaixo sua pokedex 👇\n\n${formatedCapturedPokemons}`)
    }
}
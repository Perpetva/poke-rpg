import { sendMessage } from '../../services/wapi.js'
import Jogador from '../../models/Jogador.js'
import { firstLetterUpperCase } from '../../utils/commonFunctions.js'

export default {
    name: 'parceiro',
    description: 'Torna o pokemon escolhido como parceiro',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)
        const pokemonName = args[0]?.trim()

        if (!currentPlayer)
            return await sendMessage(groupId, '⚠️ Você precisa se registrar primeiro usando o comando !registrar *seu nick*')

        if (!pokemonName)
            return await sendMessage(groupId, 'Por favor, informe o nome do pokémon. _Exemplo: !parceiro pikachu_')

        const currentPokemon = await currentPlayer.getPokemonByName(pokemonName)

        if (!currentPokemon)
            return await sendMessage(groupId, `❌ Você não possui um pokémon chamado ${pokemonName}!`)

        const selectedPokemonId = await currentPlayer.setPartnerPokemonId(currentPokemon.id)

        if (!selectedPokemonId)
            return await sendMessage(groupId, '❌ Não foi possível definir seu parceiro agora.')

        const pokemonUppercaseName = firstLetterUpperCase(currentPokemon.name)
        return await sendMessage(groupId, `${currentPlayer.getName()}, *✅ ${pokemonUppercaseName}* agora é o seu parceiro.`)
    }
}
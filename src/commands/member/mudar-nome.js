import { sendMessage } from '../../services/wapi.js'
import Jogador from '../../models/Jogador.js'
import { CHANGE_NAME_PRICE } from '../../pokemon/config/prices.js'

export default {
    name: 'mudar-nome',
    description: 'Muda o nome do jogador',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)

        if (!currentPlayer)
            return await sendMessage(groupId, '⚠️ Você precisa se registrar primeiro usando o comando !registrar *seu nick*')

        if (currentPlayer.getPokeCoins() < CHANGE_NAME_PRICE)
            return await sendMessage(groupId, `❌ Você não tem PokéCoins suficientes para mudar seu nome. O custo é de ${CHANGE_NAME_PRICE} PokéCoins.`)

        if (args.length === 0)
            return await sendMessage(groupId, '⚠️ Por favor, especifique o novo nome do jogador.')

        const newName = args.join(' ')
        currentPlayer.setName(newName)

        const newPokeCoinsValue = currentPlayer.getPokeCoins() - CHANGE_NAME_PRICE
        currentPlayer.setPokeCoins(newPokeCoinsValue)

        return await sendMessage(groupId, `✅ Seu nome foi alterado para: ${newName}! E você está com ${currentPlayer.getPokeCoins()} PokéCoins.`)

    }
}
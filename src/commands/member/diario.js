import { sendMessage } from '../../services/wapi.js'
import Jogador from '../../models/Jogador.js'
import { randomNumber } from '../../utils/commonFunctions.js'

export default {
    name: 'diario',
    description: 'Coleta a recompensa diária do jogador',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)

        if (!currentPlayer)
            return await sendMessage(groupId, '⚠️ Você precisa se registrar primeiro usando o comando !registrar *seu nick*')

        if (!currentPlayer.canCollectDaily()) {
            return await sendMessage(groupId, `❌ ${currentPlayer.getName()} Você já coletou sua recompensa diária hoje! Volte amanhã.`)
        }

        const randomPokecoins = randomNumber(300, 500)
        const hoje = new Date().toISOString().split('T')[0]

        await currentPlayer.refreshDailyLogin(hoje)

        const newPokecoins = currentPlayer.getPokeCoins() + randomPokecoins
        await currentPlayer.setPokeCoins(newPokecoins)

        const quantityItems = randomNumber(1, 3) 

        return await sendMessage(groupId, `${currentPlayer.getName()} recebeu sua recompensa diária:\n\n*₹${randomPokecoins} PokéCoins!*`)
    }
}
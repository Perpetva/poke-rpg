import { sendMessage } from '../../services/wapi.js'
import Jogador from '../../models/Jogador.js'

export default {
    name: 'vender',
    description: 'Informa como vender pokémons e itens',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)

        if (!currentPlayer)
            return await sendMessage(groupId, '⚠️ Você precisa se registrar primeiro usando o comando !registrar *seu nick*')

        const message = `Para vender pokémons use "!vender-pokemon *Nome do pokémon*\nPara vender itens use "!vender-item *Nome do item*"\n\nVeja mais comandos em !comandos\n\n> ${currentPlayer.getName()}`
        return await sendMessage(groupId, message)
    }
}
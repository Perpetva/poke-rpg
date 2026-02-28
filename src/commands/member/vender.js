import { sendMessage } from '../../services/wapi.js'
import Jogador from '../../models/Jogador.js'

export default {
    name: 'vender',
    description: 'Informa como vender pokémons e itens',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)

        const message = `Olá _${currentPlayer.getName()}_!\n\nPara vender pokémons use "!vender-pokemon *Nome do pokémon*\nPara vender itens use "!vender-item *Nome do item*"\n\nVeja mais comandos em !comandos`
        sendMessage(groupId, message)
    }
}
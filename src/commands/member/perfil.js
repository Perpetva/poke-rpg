import { perfilMessage } from '../../middlewares/defaultMessages.js';
import { sendMessage } from '../../services/wapi.js'
import Jogador from '../../models/Jogador.js'

export default {
    name: 'perfil',
    description: 'Mostra o perfil do jogador',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)
        if (!currentPlayer)
            return await sendMessage(groupId, { text: '⚠️ Você precisa se registrar primeiro usando o comando !registrar <nickname>' });

        const profileMessage = perfilMessage(currentPlayer)

        if (!currentPlayer.getPicUrl()) {
            return sendMessage(groupId, `${profileMessage}\n\n⚠️ Você ainda não tem foto de jogador. Para adicionar digite: _!foto <link da imagem>_`)
        }

        return await sendMessage(groupId, profileMessage)
    }
}
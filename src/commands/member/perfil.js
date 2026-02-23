import { perfilMessage } from '../../middlewares/defaultMessages.js';
import { imageBufferToBase64DataUri, sendImageWithCaption, sendMessage } from '../../services/wapi.js'
import Jogador from '../../models/Jogador.js'

export default {
    name: 'perfil',
    description: 'Mostra o perfil do jogador',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)
        
        if (!currentPlayer)
            return await sendMessage(groupId, '⚠️ Você precisa se registrar primeiro usando o comando !registrar *seu nick*')

        const profileImageBuffer = currentPlayer.getProfileImage() 
        const profileMessage = await perfilMessage(currentPlayer)
        
        if (!profileImageBuffer) {
            return await sendMessage(groupId, `${profileMessage}\n\n⚠️ Você ainda não tem foto de jogador. Para adicionar, envie uma imagem com a legenda _!foto_.`)
        }

        const profilePhoto = imageBufferToBase64DataUri(profileImageBuffer)

        return await sendImageWithCaption(
            groupId,
            profilePhoto,
            profileMessage
        )
    }
}
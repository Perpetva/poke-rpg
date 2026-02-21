import { sendMessage, sendImageWithCaption, downloadImageMedia, imageBufferToBase64DataUri, extractImageMessageMetadata } from "../../services/wapi.js"
import Jogador from "../../models/Jogador.js"

export default {
    name: 'foto',
    description: 'Atualiza a foto do jogador',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)

        if (!currentPlayer)
            return await sendMessage(groupId, '⚠️ Você precisa se registrar primeiro usando o comando !registrar <nickname>')

        const imageMetadata = extractImageMessageMetadata(objMessage)
        if (!imageMetadata) {
            return await sendMessage(groupId, '⚠️ Envie uma imagem com a legenda _!foto_ para atualizar sua foto de perfil.')
        }

        let mediaResult
        try {
            mediaResult = await downloadImageMedia(imageMetadata)
        } catch (error) {
            console.error('Erro no download da imagem de perfil:', error)
            return await sendMessage(groupId, '⚠️ Não foi possível baixar essa imagem. Tente novamente com uma imagem PNG/JPG/JPEG.')
        }

        const { imageBuffer, mimeType } = mediaResult
        await currentPlayer.setProfileImage(imageBuffer)

        const base64ProfileImage = imageBufferToBase64DataUri(imageBuffer, mimeType)

        return await sendImageWithCaption(
            groupId,
            base64ProfileImage,
            `✅ Foto de jogador atualizada com sucesso, *${currentPlayer.getName()}*!`
        )
    }
}
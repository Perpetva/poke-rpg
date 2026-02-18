import { sendMessage, sendImageWithCaption } from "../../services/wapi.js"
import Jogador from "../../models/Jogador.js"
import { isImageUrl } from "../../utils/isImageUrl.js"

export default {
    name: 'foto',
    description: 'Atualiza a foto do jogador',
    async execute(objMessage, args, userPhone, groupId) {   
        const currentPlayer = await Jogador.getPlayerById(userPhone)
        const myUrlPhoto = args[0]

        console.log('ENTROU NO FOTO 1')
        
        if (!currentPlayer)
            return await sendMessage(groupId, '⚠️ Você precisa se registrar primeiro usando o comando !registrar <nickname>')

        console.log('ENTROU NO FOTO 2')

        if (!myUrlPhoto || !(await isImageUrl(myUrlPhoto)))
            return await sendMessage(groupId, '⚠️ Por favor, forneça um link válido para a foto, só é permitido extensões .jpeg, .jpg, .png.' )

        console.log('ENTROU NO FOTO 3')

        await currentPlayer.setFotoUrl(myUrlPhoto)

        return sendImageWithCaption(
            groupId,
            myUrlPhoto,
            `✅ Foto de jogador atualizada com sucesso, *${currentPlayer.getName()}*!`
        )
    }
}
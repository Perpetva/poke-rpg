import { sendMessage, sendImageWithCaption } from "../../services/wapi.js"
import Jogador from "../../models/Jogador.js"
import { storeMessage } from "../../middlewares/defaultMessages.js"
import { POKESTORE_IMAGE } from "../../pokemon/config/config.js"

export default {
    name: 'loja',
    description: 'Mostra a loja de itens',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)

        if (!currentPlayer)
            return await sendMessage(groupId, '⚠️ Você precisa se registrar primeiro usando o comando !registrar *seu nick*')

        const messageStore = storeMessage(currentPlayer)

        return await sendImageWithCaption(
            groupId,
            POKESTORE_IMAGE,
            messageStore
        )
    }
}
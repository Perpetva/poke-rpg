import { sendStickerBadge, sendMessage } from '../../services/wapi.js'
import Jogador from '../../models/Jogador.js'
import { translatePokemonTypes } from '../../pokemon/commonPokemonFunctions.js'

export default {
    name: 'insignia',
    description: 'Mostra a insígnia do jogador',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)

        if (!currentPlayer)
            return await sendMessage(groupId, '⚠️ Você precisa se registrar primeiro usando o comando !registrar *seu nick*')

        const { urlBadge, occurrence, typeName } = await currentPlayer.insignia()

        if (!urlBadge)
            return await sendMessage(groupId, '⚠️ Você ainda não capturou nenhum Pokémon.')

        const typeNameTranslated = translatePokemonTypes([typeName])

        const message = `O tipo que você mais tem é: *${typeNameTranslated}* com ${occurrence} Pokémon(s)!\n\nE sua insígnia é...`

        await sendMessage(groupId,  message)
        await sendStickerBadge(groupId, urlBadge)
    }
}
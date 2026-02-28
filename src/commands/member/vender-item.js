import { sendMessage } from '../../services/wapi.js'
import Jogador from '../../models/Jogador.js'
import { sellItem } from '../../pokemon/storeActions.js'
import { POKEBALL_PRICE, POTION_PRICE, REVIVE_PRICE, FULL_RESTORE_PRICE, RARE_CANDY_PRICE } from '../../pokemon/config/prices.js'

export default {
    name: 'vender-item',
    description: 'Vende um item do jogador',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)
        const itemName = args[0]?.trim()

        if (!currentPlayer)
            return await sendMessage(groupId, '⚠️ Você precisa se registrar primeiro usando o comando !registrar *seu nick*')

        if (!itemName)
            return await sendMessage(groupId, '⚠️ Indique o nome do item que deseja vender.\n\n Exemplo: _!vender-item pocao_')

        const itemToSell = args.join(' ').toLowerCase()

        switch (itemToSell) {
            case 'pokebola':
                await sellItem(currentPlayer, groupId, 'pokebola', POKEBALL_PRICE)
                break

            case 'pocao':
                await sellItem(currentPlayer, groupId, 'pocao', POTION_PRICE)
                break

            case 'reviver':
                await sellItem(currentPlayer, groupId, 'reviver', REVIVE_PRICE)
                break

            case 'cura total':
                await sellItem(currentPlayer, groupId, 'cura total', FULL_RESTORE_PRICE)
                break

            case 'doce raro':
                await sellItem(currentPlayer, groupId, 'doce raro', RARE_CANDY_PRICE)
                break

            default:
                return await sendMessage(groupId, '❌ Item inválido.')
        }


    }
}
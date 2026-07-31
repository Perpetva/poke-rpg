import { sendMessage } from '../../services/wapi.js'
import Jogador from '../../models/Jogador.js'
import { POKEBALL_PRICE, POTION_PRICE, REVIVE_PRICE, FULL_RESTORE_PRICE, RARE_CANDY_PRICE } from '../../pokemon/config/prices.js'
import { buyItem } from '../../pokemon/storeActions.js'

export default {
    name: 'comprar',
    description: 'Compra itens do poke mart',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)

        if (!currentPlayer)
            return await sendMessage(groupId, '⚠️ Você precisa se registrar primeiro usando o comando !registrar *seu nick*')

        if (args.length === 0)
            return await sendMessage(groupId, '⚠️ Por favor, especifique o item que deseja comprar.')

        const itemName = args[0]?.trim().toLowerCase()
        const quantity = parseInt(args[1]) || 1

        switch (itemName) {
            case 'pokebola':
                await buyItem(currentPlayer, groupId, 'pokebola', POKEBALL_PRICE, quantity)
                break

            case 'pocao':
                await buyItem(currentPlayer, groupId, 'pocao', POTION_PRICE, quantity)
                break

            case 'reviver':
                await buyItem(currentPlayer, groupId, 'reviver', REVIVE_PRICE, quantity)
                break

            case 'cura total':
                await buyItem(currentPlayer, groupId, 'cura_total', FULL_RESTORE_PRICE, quantity)
                break

            case 'doce raro':
                await buyItem(currentPlayer, groupId, 'doce_raro', RARE_CANDY_PRICE, quantity)
                break

            default:
                return await sendMessage(groupId, '❌ Item inválido.')
        }
    }
}
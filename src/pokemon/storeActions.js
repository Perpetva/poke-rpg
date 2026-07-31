import { sendMessage } from '../services/wapi.js'

export async function buyItem(currentPlayer, groupId, itemName, itemPrice, quantity = 1) {
    if (currentPlayer.getPokeCoins() >= itemPrice * quantity) {
        const updatedPokeCoins = currentPlayer.getPokeCoins() - (itemPrice * quantity)
        await currentPlayer.setPokeCoins(updatedPokeCoins)
        await currentPlayer.updateItem(itemName, quantity)

        return sendMessage(groupId, `✅ ${currentPlayer.getName()}, você comprou ${quantity} ${itemName}(s)! Seu saldo agora é de ${currentPlayer.getPokeCoins()} PokéCoins.`)
    }

    return sendMessage(groupId, `❌ Você não tem PokéCoins suficientes para comprar uma ${itemName}.`)
}

export async function sellItem(currentPlayer, groupId, itemName, itemPrice, quantity = 1) {
    if (currentPlayer.hasItem(itemName, quantity)) {
        const updatedPokeCoins = currentPlayer.getPokeCoins() + Math.floor(itemPrice * 0.9 * quantity)

        await currentPlayer.setPokeCoins(updatedPokeCoins)
        await currentPlayer.updateItem(itemName, -quantity) 

        return sendMessage(groupId, `✅ ${currentPlayer.getName()}, você vendeu ${quantity} ${itemName}(s)! Seu saldo agora é de ${currentPlayer.getPokeCoins()} PokéCoins.`);
    }

    return sendMessage(groupId, `❌ Você não tem ${itemName} para vender.`);
}
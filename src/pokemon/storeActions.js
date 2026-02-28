import { sendMessage } from '../services/wapi.js'

export async function buyItem(currentPlayer, groupId, itemName, itemPrice) {
    if (currentPlayer.getPokeCoins() >= itemPrice) {
        const updatedPokeCoins = currentPlayer.getPokeCoins() - itemPrice
        await currentPlayer.setPokeCoins(updatedPokeCoins)
        await currentPlayer.updateItem(itemName, 1)

        return sendMessage(groupId, `✅ ${currentPlayer.getName()}, você comprou 1 ${itemName}! Seu saldo agora é de ${currentPlayer.getPokeCoins()} PokéCoins.`)
    }

    return sendMessage(groupId, `❌ Você não tem PokéCoins suficientes para comprar uma ${itemName}.`)
}

export async function sellItem(currentPlayer, groupId, itemName, itemPrice) {
    if (currentPlayer.hasItem(itemName, 1)) {
        const updatedPokeCoins = currentPlayer.getPokeCoins() + Math.floor(itemPrice * 0.9)

        await currentPlayer.setPokeCoins(updatedPokeCoins)
        await currentPlayer.updateItem(itemName, -1) 

        return sendMessage(groupId, `✅ ${currentPlayer.getName()}, você vendeu 1 ${itemName}! Seu saldo agora é de ${currentPlayer.getPokeCoins()} PokéCoins.`);
    }

    return sendMessage(groupId, `❌ Você não tem ${itemName} para vender.`);
}
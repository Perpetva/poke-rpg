import { sendMessage } from '../../services/wapi.js'
import Jogador from '../../models/Jogador.js'
import { sellItem } from '../../pokemon/storeActions.js'
import { POKEBALL_PRICE, POTION_PRICE, REVIVE_PRICE, FULL_RESTORE_PRICE, RARE_CANDY_PRICE } from '../../pokemon/config/prices.js'

export default {
    name: 'vender',
    description: 'Informa como vender pokémons e itens',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)
        const itemOrPokemonToSell = args[0]?.trim()

        if (!currentPlayer)
            return await sendMessage(groupId, '⚠️ Você precisa se registrar primeiro usando o comando !registrar *seu nick*')

        if (!itemOrPokemonToSell)
            return await sendMessage(groupId, `⚠️ Indique o nome do que deseja vender.\n> ${currentPlayer.getName()}`)

        const items = ['pokebola', 'pocao', 'reviver', 'cura total', 'doce raro', 'elixir']
        const quantity = parseInt(args[1]) || 1

        if (itemOrPokemonToSell && items.includes(itemOrPokemonToSell)) {
            const itemToSell = itemOrPokemonToSell.toLowerCase()

            switch (itemToSell) {
                case 'pokebola':
                    return await sellItem(currentPlayer, groupId, 'pokebola', POKEBALL_PRICE, quantity)
                    break

                case 'pocao':
                    return await sellItem(currentPlayer, groupId, 'pocao', POTION_PRICE, quantity)
                    break

                case 'reviver':
                    return await sellItem(currentPlayer, groupId, 'reviver', REVIVE_PRICE, quantity)
                    break

                case 'cura total':
                    return await sellItem(currentPlayer, groupId, 'cura total', FULL_RESTORE_PRICE, quantity)
                    break

                case 'doce raro':
                    return await sellItem(currentPlayer, groupId, 'doce raro', RARE_CANDY_PRICE, quantity)
                    break

                default:
                    return await sendMessage(groupId, '❌ Item inválido.')
            }
        }

        const pokemonToSell = await currentPlayer.getPokemonByName(itemOrPokemonToSell)

        if (!pokemonToSell)
            return await sendMessage(groupId, `❌ Você não tem o Pokémon ${itemOrPokemonToSell} para vender.`)

        const pokemonPrice = pokemonToSell.getPrice()
        const pokeCoinsAtualizados = currentPlayer.getPokeCoins() + pokemonPrice

        await pokemonToSell.deletePokemon()
        await currentPlayer.setPokeCoins(pokeCoinsAtualizados)

        return await sendMessage(groupId, `💰 Você vendeu o Pokémon ${pokemonToSell.getName()} por ${pokemonPrice} PokéCoins!`)
    }
}
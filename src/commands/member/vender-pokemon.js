import { sendMessage } from '../../services/wapi.js'
import Jogador from '../../models/Jogador.js'

export default {
    name: 'vender-pokemon',
    description: 'Vende um pokemon do jogador',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)
        const pokemonName = args[0]?.trim()
        

        if (!currentPlayer)
            return await sendMessage(groupId, '⚠️ Você precisa se registrar primeiro usando o comando !registrar *seu nick*')

        if (!pokemonName)
            return await sendMessage(groupId, '⚠️ Indique o nome do Pokémon que deseja vender.\n\n Exemplo: _!vender-pokemon pikachu_')

        const pokemonToSell = await currentPlayer.getPokemonByName(pokemonName)

        if (!pokemonToSell)
            return await sendMessage(groupId, `❌ Você não tem o Pokémon ${pokemonName} para vender.`)

        const pokemonPrice = pokemonToSell.getPrice()
        const pokeCoinsAtualizados = currentPlayer.getPokeCoins() + pokemonPrice

        await pokemonToSell.deletePokemon()
        await currentPlayer.setPokeCoins(pokeCoinsAtualizados)

        return await sendMessage(groupId, `💰 Você vendeu o Pokémon ${pokemonToSell.getName()} por ${pokemonPrice} PokéCoins!`)

    }
}
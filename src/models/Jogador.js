import Pokemon from './Pokemon.js'
import Item from './Item.js'

class Jogador {
    constructor(id, name, phone) {
        this.id = id
        this.name = name
        this.phone = phone
        this.picUrl = null
        this.pokeCoins = 500
        this.diaryLogin = null
        this.items = new Item()
        this.pokemons = []
    }

    addPokemon(pokemon) {
        this.pokemons.push(pokemon)
        pokemon.setOwner(this)
    }

    getPokemons() {
        return this.pokemons
    }

    getItems() {
        return this.items
    }

    getName() {
        return this.name
    }

    getId() {
        return this.id
    }

    getPhone() {
        return this.phone
    }

    getPokeCoins() {
        return this.pokeCoins
    }

    getPicUrl() {
        return this.picUrl
    }

    totalPokemonsOwned() {
        return this.pokemons.length
    }

    getPokebola() {
        return this.items.getItemCount('pokeBalls')
    }

    getPocao() {
        return this.items.getItemCount('potions')
    }

    getReviver() {
        return this.items.getItemCount('revives')
    }

    getCuraTotal() {
        return this.items.getItemCount('totalCures')
    }

    getDoceRaro() {
        return this.items.getItemCount('rareCandies')
    }
}

export default Jogador

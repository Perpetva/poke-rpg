import Pokemon from './Pokemon.js'
import Item from './Item.js'
import { createNewPlayer } from '../prisma/createNewPlayer.js'
import { getPlayerByIdFromDb } from '../prisma/getPlayerByIdFromDb.js'

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

    static async registerNewPlayer(id, phone, name) {
        const dbPlayer = await createNewPlayer(id, phone, name)
        return new Jogador(dbPlayer.id, dbPlayer.name, dbPlayer.phone)
    }

    static async getPlayerById(phone) {
        const record = await getPlayerByIdFromDb(phone)
        if (!record) return null

        return new Jogador(record.id, record.name, record.phone)
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
}

export default Jogador

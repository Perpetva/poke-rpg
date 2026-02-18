import { connectToDatabase } from '../database/connectionDatabase.js'
import * as queries from './queries/queries.js'
import Item from './Item.js'

class Jogador {
    constructor(id, name, phone, picUrl = null, pokeCoins = 500, diaryLogin = null, items = new Item()) {
        this.id = id
        this.name = name
        this.phone = phone
        this.picUrl = picUrl
        this.pokeCoins = pokeCoins
        this.diaryLogin = diaryLogin
        this.items = items
        this.pokemons = []
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

    async setFotoUrl(url) {
        const pool = await connectToDatabase()
        await pool.query(queries.UPDATE_PLAYER_PIC_URL, [url, this.id])
        this.picUrl = url
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

    static async getPlayerById(id) {
        const pool = await connectToDatabase()
        const res = await pool.query(queries.GET_PLAYER_BY_ID, [id])

        if (res.rowCount === 0) return null

        return Jogador.fromDbRow(res.rows[0])
    }

    static fromDbRow(row) {
        const items = Item.fromDbRow(row)

        return new Jogador(
            row.id,
            row.name,
            row.phone,
            row.picUrl ?? null,
            row.pokeCoins ?? 500,
            row.diaryLogin ?? null,
            items
        )
    }

    static async createPlayer({ id, name, phone }) {
        const pool = await connectToDatabase()
        const client = await pool.connect()

        try {
            await client.query('BEGIN')

            const playerRes = await client.query(queries.CREATE_PLAYER, [id, name, phone])
            const itemRes = await client.query(queries.CREATE_PLAYER_ITEMS, [id])

            await client.query('COMMIT')

            return Jogador.fromDbRow({
                ...playerRes.rows[0],
                ...itemRes.rows[0]
            })
        } catch (error) {
            await client.query('ROLLBACK')
            throw error
        } finally {
            client.release()
        }
    }
}

export default Jogador

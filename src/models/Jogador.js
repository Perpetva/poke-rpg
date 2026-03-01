import { connectToDatabase } from '../database/connectionDatabase.js'
import * as queries from './queries/queries.js'
import Item from './Item.js'
import Pokemon from './Pokemon.js'
import { checkInsignia } from '../pokemon/badges/badges.js'

const ITEM_NAME_MAP = {
    pokeball: 'pokeBalls',
    pokeballs: 'pokeBalls',
    pokebola: 'pokeBalls',
    pokebolas: 'pokeBalls',
    potion: 'potions',
    potions: 'potions',
    pocao: 'potions',
    pocoes: 'potions',
    revive: 'revives',
    revives: 'revives',
    reviver: 'revives',
    totalcure: 'totalCures',
    totalcures: 'totalCures',
    curetotal: 'totalCures',
    curetotals: 'totalCures',
    cura_total: 'totalCures',
    'cura total': 'totalCures',
    rarecandy: 'rareCandies',
    rarecandies: 'rareCandies',
    doceraro: 'rareCandies',
    docesaros: 'rareCandies',
    doce_raro: 'rareCandies',
    'doce raro': 'rareCandies'
}

class Jogador {
    constructor(id, name, phone, profileImage = null, pokeCoins = 500, diaryLogin = null, items = new Item()) {
        this.id = id
        this.name = name
        this.phone = phone
        this.profileImage = profileImage
        this.pokeCoins = pokeCoins
        this.diaryLogin = diaryLogin
        this.items = items
    }

    getName() {
        return this.name
    }

    async setName(newName) {
        const formatedName = String(newName || '').trim()
        if (!formatedName) return null

        const pool = await connectToDatabase()
        await pool.query(queries.UPDATE_PLAYER_NAME, [formatedName, this.id])
        this.name = formatedName

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

    getProfileImage() {
        return this.profileImage
    }

    async setProfileImage(imageBuffer) {
        const pool = await connectToDatabase()
        await pool.query(queries.UPDATE_PLAYER_PROFILE_IMAGE, [imageBuffer, this.id])
        this.profileImage = imageBuffer
    }

    async setPokeCoins(amount) {
        const parsedAmount = Number(amount)
        if (!Number.isFinite(parsedAmount)) return null

        const sanitizedAmount = Math.max(0, Math.floor(parsedAmount))

        const pool = await connectToDatabase()
        await pool.query(queries.UPDATE_PLAYER_POKE_COINS, [sanitizedAmount, this.id])
        this.pokeCoins = sanitizedAmount

        return this.pokeCoins
    }

    canCollectDaily() {
        const today = new Date().toISOString().split('T')[0]

        if (!this.diaryLogin) return true

        const parsedLastLoginDate = new Date(this.diaryLogin)
        if (Number.isNaN(parsedLastLoginDate.getTime())) return true

        const lastLogin = parsedLastLoginDate.toISOString().split('T')[0]

        return lastLogin !== today
    }

    async refreshDailyLogin(loginDate = new Date().toISOString().split('T')[0]) {
        const pool = await connectToDatabase()
        const res = await pool.query(queries.UPDATE_PLAYER_DAILY_LOGIN_IF_ELIGIBLE, [loginDate, this.id])

        if (res.rowCount === 0) {
            return false
        }

        this.diaryLogin = res.rows[0].diaryLogin
        return true
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

    hasItem(itemName, minQuantity = 1) {
        const normalizedItemName = String(itemName || '').toLowerCase().trim()
        const mappedColumnName = ITEM_NAME_MAP[normalizedItemName]
        if (!mappedColumnName) return false

        const requiredQuantity = Number(minQuantity)
        if (!Number.isFinite(requiredQuantity) || requiredQuantity <= 0) return false

        const currentQuantity = Number(this.items.getItemCount(mappedColumnName) ?? 0)
        return currentQuantity >= requiredQuantity
    }

    async updateItem(itemName, quantity) {
        const normalizedItemName = String(itemName || '').toLowerCase().trim()
        const mappedColumnName = ITEM_NAME_MAP[normalizedItemName]
        if (!mappedColumnName) return null

        const parsedQuantity = Number(quantity)
        if (!Number.isFinite(parsedQuantity)) return null

        const pool = await connectToDatabase()

        const itemRes = await pool.query(queries.GET_PLAYER_ITEM_BY_ID, [this.id])
        if (itemRes.rowCount === 0) return null

        const currentQuantity = Number(itemRes.rows[0][mappedColumnName] ?? 0)
        const nextQuantity = Math.max(0, currentQuantity + parsedQuantity)

        const updatedRes = await pool.query(queries.UPDATE_PLAYER_ITEM_BY_ID(mappedColumnName), [nextQuantity, this.id])
        if (updatedRes.rowCount === 0) return null

        this.items = Item.fromDbRow(updatedRes.rows[0])

        return this.items.getItemCount(mappedColumnName)
    }

    async getPokemonByName(pokemonName) {
        const pool = await connectToDatabase()
        const res = await pool.query(queries.GET_PLAYER_POKEMON_BY_NAME, [this.id, pokemonName])

        if (res.rowCount === 0) return null

        const pokemonRow = res.rows[0]

        return new Pokemon(
            pokemonRow.id,
            pokemonRow.specieId,
            pokemonRow.name,
            pokemonRow.exp,
            pokemonRow.currentHp,
            pokemonRow.types,
            pokemonRow.evolutionStage,
            pokemonRow.nextEvolutionLevel,
            {
                hp: Number(pokemonRow.ivHp ?? 0),
                speed: Number(pokemonRow.ivSpeed ?? 0),
                attack: Number(pokemonRow.ivAttack ?? 0),
                defense: Number(pokemonRow.ivDefense ?? 0),
                specialAttack: Number(pokemonRow.ivSpecialAttack ?? 0),
                specialDefense: Number(pokemonRow.ivSpecialDefense ?? 0)
            },
            null,
            [],
            pokemonRow.jogadorId ?? this.id
        )
    }

    async getPokedex() {
        const pool = await connectToDatabase()
        const res = await pool.query(queries.GET_PLAYER_POKEDEX, [this.id])

        return res.rows
    }

    async capturePokemon(instanciaPokemon) {
        if (!instanciaPokemon) return null

        const pool = await connectToDatabase()
        const client = await pool.connect()

        try {
            await client.query('BEGIN')

            const iv = instanciaPokemon.iv || {}
            const ivRes = await client.query(queries.CREATE_IV, [
                Number(iv.hp ?? 1),
                Number(iv.speed ?? 1),
                Number(iv.attack ?? 1),
                Number(iv.defense ?? 1),
                Number(iv.specialAttack ?? 1),
                Number(iv.specialDefense ?? 1)
            ])

            const baseStats = instanciaPokemon.baseStats || {}
            const baseStatsRes = await client.query(queries.CREATE_BASE_STATS, [
                Number(baseStats.hp ?? 1),
                Number(baseStats.speed ?? 1),
                Number(baseStats.attack ?? 1),
                Number(baseStats.defense ?? 1),
                Number(baseStats.specialAttack ?? 1),
                Number(baseStats.specialDefense ?? 1)
            ])

            const pokemonRes = await client.query(queries.CREATE_POKEMON, [
                Number(instanciaPokemon.specieId),
                instanciaPokemon.name,
                Number(instanciaPokemon.level ?? 1),
                Number(instanciaPokemon.exp ?? 0),
                Number(instanciaPokemon.currentHp ?? baseStats.hp ?? 1),
                Array.isArray(instanciaPokemon.types) ? instanciaPokemon.types : [],
                Number(instanciaPokemon.evolutionStage ?? 1),
                Number(instanciaPokemon.nextEvolutionLevel ?? 0),
                this.id,
                ivRes.rows[0].id,
                baseStatsRes.rows[0].id
            ])

            const capturedPokemonId = pokemonRes.rows[0].id
            instanciaPokemon.id = capturedPokemonId
            instanciaPokemon.setOwner(this.id)

            const moves = Array.isArray(instanciaPokemon.moves) ? instanciaPokemon.moves : []
            for (const move of moves) {
                await client.query(queries.CREATE_MOVE, [
                    move.name,
                    move.type,
                    Number(move.maxPp ?? move.pp ?? 1),
                    Number(move.currentPp ?? move.maxPp ?? move.pp ?? 1),
                    Number(move.power ?? 1),
                    Number(move.accuracy ?? 100),
                    move.moveCategory ?? move.damageClass ?? 'physical',
                    capturedPokemonId
                ])
            }

            await client.query('COMMIT')
            return capturedPokemonId
        } catch (error) {
            await client.query('ROLLBACK')
            console.error('Erro ao capturar pokémon:', error)
            return null
        } finally {
            client.release()
        }
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
            row.profileImage ?? null,
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

    async insignia() {
        const countTypes = {}
        const currentPokemons = await this.getPokedex();

        for (const pokemon of currentPokemons) {
            for (const type of pokemon.types) {
                countTypes[type] = (countTypes[type] || 0) + 1;
            }
        }

        const mostCommonType = Object.entries(countTypes).reduce((moreCommon, current) => {
            return current[1] > moreCommon[1] ? current : moreCommon;
        });

        const { urlBadge, typeName } = checkInsignia(mostCommonType[0])
        const occurrence = mostCommonType[1];

        return {
            urlBadge,
            occurrence,
            typeName
        }
    }
}

export default Jogador

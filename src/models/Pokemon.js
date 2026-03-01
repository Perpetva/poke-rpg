import { randomNumber } from '../utils/commonFunctions.js'
import { connectToDatabase } from '../database/connectionDatabase.js'
import * as queries from './queries/queries.js'

class Pokemon {
    constructor(
        id,
        specieId,
        name,
        exp,
        currentHp,
        types,
        evolutionStage,
        nextEvolutionLevel,
        iv,
        baseStats,
        moves,
        owner = null
    ) {
        this.id = id
        this.specieId = specieId
        this.name = name
        this.exp = exp
        this.currentHp = currentHp
        this.types = types
        this.evolutionStage = evolutionStage
        this.nextEvolutionLevel = nextEvolutionLevel
        this.iv = iv
        this.baseStats = baseStats
        this.moves = moves
        this.owner = owner
    }

    setOwner(owner) {
        this.owner = owner
    }

    getOwner() {
        return this.owner
    }

    getMoves() {
        return this.moves
    }

    getName() {
        return this.name
    }

    getPrice() {
        const ivObject = this.iv || {}
        let ivSum = 0

        for (const ivStatName in ivObject) {
            if (Object.prototype.hasOwnProperty.call(ivObject, ivStatName)) {
                const ivStatValue = Number(ivObject[ivStatName] ?? 0)
                if (Number.isFinite(ivStatValue)) {
                    ivSum += ivStatValue
                }
            }
        }

        const parsedExp = Number(this.exp ?? 0)
        const safeExp = Number.isFinite(parsedExp) ? Math.max(0, parsedExp) : 0
        const level = Math.max(1, Math.round(Math.cbrt(safeExp)))

        if (level <= 1) return Math.max(1, Math.ceil(ivSum))

        const sellPrice = Math.ceil(ivSum * (level / (level - 1)))
        return Math.max(1, sellPrice)
    }

    async deletePokemon() {
        if (!this.id) return false

        const pool = await connectToDatabase()
        const res = await pool.query(queries.DELETE_POKEMON_BY_ID, [this.id])

        return res.rowCount > 0
    }

    async escapePokemonChance() {
        const chance = await randomNumber(1, 100)
        if (chance <= 25)
            return true

        return false
    }
}

export default Pokemon

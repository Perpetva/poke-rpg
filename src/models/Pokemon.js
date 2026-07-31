import { randomNumber } from '../utils/commonFunctions.js'
import { connectToDatabase } from '../database/connectionDatabase.js'
import * as queries from './queries/queries.js'
import { XP_MAX, NIVEL_MAX, NIVEL_MIN, FLED_CHANCE, ESCAPE_CHANCE } from "../pokemon/config/config.js"

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

    getBattleLevel() {
        return this.getLevel()
    }

    calculateBattleStat(baseStatName, ivStatName = baseStatName) {
        const baseStats = this.baseStats || {}
        const iv = this.iv || {}
        const level = this.getBattleLevel()
        const baseStat = Number(baseStats[baseStatName] ?? 0)
        const ivStat = Number(iv[ivStatName] ?? 0)

        if (baseStatName === 'hp') {
            return Math.floor((((2 * baseStat) + ivStat) * level) / 100) + level + 10
        }

        return Math.floor((((2 * baseStat) + ivStat) * level) / 100) + 5
    }

    getBattleStat(statName) {
        return this.calculateBattleStat(statName)
    }

    getBattleHp() {
        return this.calculateBattleStat('hp')
    }

    getMaxHp() {
        return this.getBattleHp()
    }

    getBattleSpeed() {
        return this.getBattleStat('speed')
    }

    getBattleAttack() {
        return this.getBattleStat('attack')
    }

    getBattleDefense() {
        return this.getBattleStat('defense')
    }

    getBattleSpecialAttack() {
        return this.getBattleStat('specialAttack')
    }

    getBattleSpecialDefense() {
        return this.getBattleStat('specialDefense')
    }

    async setCurrentHp(currentHp) {
        const parsedCurrentHp = Number(currentHp)
        if (!Number.isFinite(parsedCurrentHp)) return null

        const sanitizedCurrentHp = Math.max(0, Math.floor(parsedCurrentHp))
        this.currentHp = sanitizedCurrentHp

        if (!this.id) return this.currentHp

        const pool = await connectToDatabase()
        const res = await pool.query(queries.UPDATE_POKEMON_CURRENT_HP_BY_ID, [sanitizedCurrentHp, this.id])

        if (res.rowCount === 0) return null

        this.currentHp = Number(res.rows[0].currentHp ?? sanitizedCurrentHp)
        return this.currentHp
    }

    async addExperience(expAmount) {
        const parsedExpAmount = Number(expAmount)
        if (!Number.isFinite(parsedExpAmount)) return null

        const nextExp = Math.max(0, Math.floor(Number(this.exp ?? 0) + parsedExpAmount))
        this.exp = nextExp

        if (!this.id) return this.exp

        const pool = await connectToDatabase()
        const res = await pool.query(queries.UPDATE_POKEMON_EXP_BY_ID, [nextExp, this.id])

        if (res.rowCount === 0) return null

        this.exp = Number(res.rows[0].exp ?? nextExp)
        return this.exp
    }

    async spendMovePp(moveName, amount = 1) {
        const normalizedMoveName = String(moveName || '').trim()
        const parsedAmount = Number(amount)

        if (!normalizedMoveName || !Number.isFinite(parsedAmount) || parsedAmount <= 0) return null

        const move = this.moves.find(currentMove => currentMove.getName().toLowerCase() === normalizedMoveName.toLowerCase())
        if (!move) return null

        const currentPp = Number(move.getCurrentPp() ?? move.currentPp ?? move.getMaxPp() ?? 0)
        const nextPp = Math.max(0, currentPp - Math.floor(parsedAmount))
        move.currentPp = nextPp

        if (!this.id) return nextPp

        const pool = await connectToDatabase()
        const res = await pool.query(queries.UPDATE_MOVE_CURRENT_PP_BY_POKEMON_AND_NAME, [nextPp, this.id, normalizedMoveName])

        if (res.rowCount === 0) return null

        move.currentPp = Number(res.rows[0].currentPp ?? nextPp)
        return move.currentPp
    }

    getName() {
        return this.name
    }

    getSpecieId() {
        return this.specieId
    }

    getCurrentHp() {
        return Math.min(Number(this.currentHp ?? 0), this.getMaxHp())
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
        console.log('CHANCE:', chance)
        if (chance <= ESCAPE_CHANCE)
            return true
        
        return false
    }

    async fledChance() {
        const chance = await randomNumber(1, 100)
        if (chance <= FLED_CHANCE)
            return true

        return false
    }

    getLevel() {
        let xp = this.exp

        if (xp < 0) xp = 0
        if (xp > XP_MAX) xp = XP_MAX

        let nivel = NIVEL_MIN

        for (let i = NIVEL_MIN; i <= NIVEL_MAX; i++) {
            const xpNecessaria = Math.floor((Math.pow(i, 3) / Math.pow(NIVEL_MAX, 3)) * XP_MAX)

            if (xp >= xpNecessaria) {
                nivel = i

            } else {
                break
            }
        }

        return nivel
    }

    getCurrentExperience() {
        let xp = this.exp

        const nivel = this.getLevel()
        const xpInicioNivel = Math.floor((Math.pow(nivel, 3) / Math.pow(NIVEL_MAX, 3)) * XP_MAX)

        return xp - xpInicioNivel
    }

    getTotalLvlExperience() {
        const nivel = this.getLevel()

        if (nivel < NIVEL_MIN) nivel = NIVEL_MIN
        if (nivel >= NIVEL_MAX) return 0

        const xpAtual = Math.floor(
            (Math.pow(nivel, 3) / Math.pow(NIVEL_MAX, 3)) * XP_MAX
        )

        const xpProximo = Math.floor(
            (Math.pow(nivel + 1, 3) / Math.pow(NIVEL_MAX, 3)) * XP_MAX
        )

        return xpProximo - xpAtual
    }

    heal() {
        const currentHp = this.getCurrentHp()
        const newHp = currentHp + Math.floor(this.getMaxHp() * 0.33)

        if (newHp > this.getMaxHp()) {
            return this.setCurrentHp(this.getMaxHp())
        }

        return this.setCurrentHp(newHp)
    }

    revive() {
        return this.setCurrentHp(1)
    }
}

export default Pokemon

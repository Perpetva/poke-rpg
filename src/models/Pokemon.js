import { randomNumber } from '../utils/commonFunctions.js'

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

    async escapePokemonChance() {
        const chance = await randomNumber(1, 100)
        if (chance <= 25)
            return true

        return false
    }
}

export default Pokemon

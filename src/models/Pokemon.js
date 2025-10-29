import Iv from './Iv.js'
import BaseStats from './BaseStats.js'
import CurrentStats from './CurrentStats.js'
import Move from './Move.js'
import Jogador from './Jogador.js'

class Pokemon {
    constructor(
        id,
        specieId,
        name,
        level,
        exp,
        maxHp,
        currentHp,
        types,
        evolutionStage,
        nextEvolutionLevel,
        iv,
        baseStats,
        currentStats,
        moves,
        owner = null
    ) {
        this.id = id
        this.specieId = specieId
        this.name = name
        this.level = level
        this.exp = exp
        this.maxHp = maxHp
        this.currentHp = currentHp
        this.types = types
        this.evolutionStage = evolutionStage
        this.nextEvolutionLevel = nextEvolutionLevel
        this.iv = iv
        this.baseStats = baseStats
        this.currentStats = currentStats
        this.moves = moves
        this.owner = owner
    }

    setOwner(jogador) {
        this.owner = jogador
    }

    getOwner() {
        return this.owner
    }

    getMoves() {
        return this.moves
    }
}

export default Pokemon

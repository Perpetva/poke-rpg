import Iv from './Iv'
import BaseStats from './BaseStats'
import CurrentStats from './CurrentStats'
import Move from './Move'
import Jogador from './Jogador'

class Pokemon {
    private id: number;
    private specieId: number;
    private name: string;
    private level: number;
    private exp: number;
    private maxHp: number;
    private currentHp: number;
    private types: string[];
    private evolutionStage: number;
    private nextEvolutionLevel: number;
    private iv: Iv;
    private baseStats: BaseStats;
    private currentStats: CurrentStats;
    private moves: Move[];
    private owner: Jogador | null;

    constructor(
        id: number,
        specieId: number,
        name: string,
        level: number,
        exp: number,
        maxHp: number,
        currentHp: number,
        types: string[],
        evolutionStage: number,
        nextEvolutionLevel: number,
        iv: Iv,
        baseStats: BaseStats,
        currentStats: CurrentStats,
        moves: Move[],
        owner: Jogador | null = null
    ) {
        this.id = id;
        this.specieId = specieId;
        this.name = name;
        this.level = level;
        this.exp = exp;
        this.maxHp = maxHp;
        this.currentHp = currentHp;
        this.types = types;
        this.evolutionStage = evolutionStage;
        this.nextEvolutionLevel = nextEvolutionLevel;
        this.iv = iv;
        this.baseStats = baseStats;
        this.currentStats = currentStats;
        this.moves = moves;
        this.owner = owner;
    }

    setOwner(jogador: Jogador) {
        this.owner = jogador;
    }

    getOwner(): Jogador | null {
        return this.owner;
    }

    getMoves(): Move[] {
        return this.moves;
    }
}

export default Pokemon;
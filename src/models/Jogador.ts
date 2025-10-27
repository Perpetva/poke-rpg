import Pokemon from './Pokemon'
import Item from './Item'

class Jogador {
    private id: number;
    private name: string;
    private phone: string;
    private picUrl: string | null;
    private pokeCoins: number;
    private diaryLogin: Date | null;
    private items: Item;
    private pokemons: Pokemon[];

    constructor(id: number, name: string, phone: string) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.picUrl = null;
        this.pokeCoins = 500;
        this.diaryLogin = null;
        this.items = new Item();
        this.pokemons = [];
    }

    addPokemon(pokemon: Pokemon) {
        this.pokemons.push(pokemon);
        pokemon.setOwner(this);
    }

    getPokemons(): Pokemon[] {
        return this.pokemons;
    }

    getItems(): Item {
        return this.items;
    }
}

export default Jogador;
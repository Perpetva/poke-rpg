import { randomNumber } from "../utils/commonFunctions.js"
import { TOTAL_POKEMONS } from "./config/config.js"

export async function isUnevolvedOrLegendaryPokemon() {
    let isValid = false;
    let chosenPokemonData = null;
    let randomId = null;

    while (!isValid) {
        randomId = await randomNumber(1, TOTAL_POKEMONS);

        const pokemonData = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
            .then(res => res.json());

        const speciesData = await fetch(pokemonData.species.url)
            .then(res => res.json());

        const evolutionChain = await fetch(speciesData.evolution_chain.url)
            .then(res => res.json());

        const baseName = evolutionChain.chain.species.name;
        const isUnevolved = baseName === pokemonData.name.toLowerCase();
        const isLegendary = speciesData.is_legendary || speciesData.is_mythical;

        if (isUnevolved && !isLegendary) {
            isValid = true;
            chosenPokemonData = pokemonData;
        }
    }

    return { chosenPokemonData, isValid, randomId }
}
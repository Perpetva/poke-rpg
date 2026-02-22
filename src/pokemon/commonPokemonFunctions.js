import { randomNumber } from "../utils/commonFunctions.js"
import { TOTAL_POKEMONS } from "./config/config.js"
import axios from "axios"

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

export async function getPokemonTypesById(pokemonId) {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        const types = response.data.types.map(typeInfo => typeInfo.type.name)
        return types
    } catch (error) {
        console.error('Erro ao obter os tipos do Pokémon:', error)
        return [];
    }
}

export function verifyGenerationById(id) {
    if (id <= 151) {
        return 'I'
    } else if (id >= 152 && id <= 251) {
        return 'II'
    } else if (id >= 252 && id <= 386) {
        return 'III'
    } else if (id >= 387 && id <= 494) {
        return 'IV'
    } else if (id >= 495 && id <= 649) {
        return 'V'
    } else if (id >= 650 && id <= 721) {
        return 'VI'
    } else if (id >= 722 && id <= 809) {
        return 'VII'
    } else if (id >= 810 && id <= 905) {
        return 'VIII'
    } else if (id >= 906 && id <= 9999) {
        return 'IX'
    } else if (id >= 10000) {
        return 'Variantes.'
    }
}

export function translatePokemonTypes(tipos) { // espera um array de tipos
    const traducoes = {
        normal: "🕳️ Normal",
        fire: "🔥 Fogo",
        water: "🫧 Água",
        grass: "🌱 Planta",
        flying: "🪽 Voador",
        fighting: "🥊 Lutador",
        poison: "☢️ Veneno",
        electric: "⚡ Elétrico",
        ground: "🍄 Terra",
        rock: "🪨 Pedra",
        psychic: "🌀 Psíquico",
        ice: "🧊 Gelo",
        bug: "🐞 Inseto",
        ghost: "👻 Fantasma",
        steel: "⚙️ Aço",
        dragon: "🐉 Dragão",
        dark: "🌑 Sombrio",
        fairy: "🪄 Fada"
    };

    return tipos.map(tipo => traducoes[tipo] || null).filter(t => t !== null).join(', ')
}

export async function getHeightAndWeightById(pokemonId) {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        const height = response.data.height / 10 ; // em decímetros - dividi por 10 para converter em metros
        const weight = response.data.weight / 10; // em hectogramas - dividi por 10 para converter em quilogramas
        return { height, weight }

    } catch (error) {
        console.error('Erro ao obter altura e peso do Pokémon:', error)
        return { height: null, weight: null }
    }
}
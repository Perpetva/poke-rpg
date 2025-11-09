import axios from 'axios';

export async function getPokemonNameById(pokemonId) {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const name = response.data.name;
        return name
    } catch (error) {
        console.error('Erro ao obter o nome do Pokémon:', error);
    }
}
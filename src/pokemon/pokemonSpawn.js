import { isUnevolvedOrLegendaryPokemon } from "./commonPokemonFunctions.js"
import { randomNumber } from "../utils/commonFunctions.js"
import { getValidMovesFromPokeAPI } from "./getValidMoves.js"
import { setPokemonAtual } from "./pokemonStructures.js"
import { getPokemonNameById } from "./getPokemonNameById.js"
import { sendSticker } from "../services/wapi.js"

const currentPokemonSpawned = {
    number: null,
    alreadyCaught: false
}

export async function pokemonSpawn(chatId) {
    const { chosenPokemonData, isValid, randomId } = await isUnevolvedOrLegendaryPokemon()

    const especie_id = chosenPokemonData.id
    const name = chosenPokemonData.name

    const baseStats = {}
    chosenPokemonData.stats.forEach(stat => {
        baseStats[stat.stat.name] = stat.base_stat
    })

    const types = chosenPokemonData.types.map(t => t.type.name)

    const exp = await randomNumber(15, 175)
    const moves = await getValidMovesFromPokeAPI(especie_id, 4)

    const currentPokemon = new Pokemon({
        especie_id,
        name,
        baseStats,
        types,
        exp,
        moves
    })

    setPokemonAtual(currentPokemon)

    await sendSticker(chatId, randomId)

    currentPokemonSpawned.alreadyCaught = false
    currentPokemonSpawned.number = randomId

    console.log(`Pokémon ID: ${randomId}\nNome: ${await getPokemonNameById(randomId)}`)
}
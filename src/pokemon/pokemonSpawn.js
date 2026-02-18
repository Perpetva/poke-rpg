import { isUnevolvedOrLegendaryPokemon } from "./commonPokemonFunctions.js"
import { randomNumber } from "../utils/commonFunctions.js"
import { getValidMovesFromPokeAPI } from "./getValidMoves.js"
import { setPokemonAtual } from "./pokemonStructures.js"
import { getPokemonNameById } from "./getPokemonNameById.js"
import { sendSticker } from "../services/wapi.js"
import Pokemon from "../models/Pokemon.js"
import { mapBaseStats } from "./mappers/baseStatsMapper.js"
import { mapIv } from "./mappers/ivMapper.js"
import { mapAverageStats } from "./mappers/averageMapper.js"

const currentPokemonSpawned = {
    number: null,
    alreadyCaught: false
}

export async function pokemonSpawn(chatId) {
    const { chosenPokemonData, isValid, randomId } = await isUnevolvedOrLegendaryPokemon()

    const especie_id = chosenPokemonData.id
    const name = chosenPokemonData.name

    const baseStats = mapBaseStats(chosenPokemonData)
    const iv = mapIv()
    const { currentHp, evolutionStage, nextEvolutionLevel } = await mapAverageStats(
        chosenPokemonData,
        baseStats
    )

    const types = chosenPokemonData.types.map(t => t.type.name)

    const exp = await randomNumber(15, 175)
    const moves = await getValidMovesFromPokeAPI(especie_id, 4)

    const currentPokemon = new Pokemon(
        null,
        especie_id,
        name,
        exp,
        currentHp,
        types,
        evolutionStage,
        nextEvolutionLevel,
        iv,
        baseStats,
        moves
    )

    setPokemonAtual(currentPokemon)

    console.log('POKEMONNNN: ', currentPokemon)

    await sendSticker(chatId, randomId)

    currentPokemonSpawned.alreadyCaught = false
    currentPokemonSpawned.number = randomId

    console.log(`Pokémon ID: ${randomId}\nNome: ${await getPokemonNameById(randomId)}`)
}
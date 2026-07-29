import { pokemonSpawn } from './pokemon/pokemonSpawn.js';
import { randomNumber } from './utils/commonFunctions.js';

const groupId = process.env.SO_OS_BONS_GROUP_ID

export async function spawnPokemonTimer() {
    setTimeout(async function spawnLoop() {
        await pokemonSpawn(groupId)

        const randomTimer = await randomNumber(480000, 900000) // 8 a 15 min

        console.log(`Próximo spawn em ${randomTimer / 60000} minutos`)

        setTimeout(spawnLoop, randomTimer)
    }, await randomNumber(480000, 900000))
}
import { connection } from "./src/connection.js"
import { spawnPokemonTimer } from "./src/spawnPokemonTimer.js"

async function start () {
    // await spawnPokemonTimer()
    await connection()
}

start()
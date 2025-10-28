import { connection } from "./src/connection.js"

async function start () {
    await connection()
}

start()
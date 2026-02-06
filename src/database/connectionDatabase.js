import { Pool } from 'pg'
import dotenv from 'dotenv'
dotenv.config()

export async function connectToDatabase() {
    if (global.connection)
        return global.connection

    const connectionUrl = `postgresql://postgres:${process.env.DB_PASSWORD}@localhost:5432/poke_rpg`

    const pool = new Pool({
        connectionString: connectionUrl
    })

    const client = await pool.connect()
    console.log('Conectado ao banco de dados com sucesso!')

    client.release()

    global.connection = pool
    return pool
}
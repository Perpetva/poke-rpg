import { Pool } from 'pg'

export async function connectToDatabase() {
    if (global.connection)
        return global.connection

    const connectionUrl = 'postgresql://postgres:admin@localhost:5432/poke_rpg'

    const pool = new Pool({
        connectionString: connectionUrl
    })

    const client = await pool.connect()
    console.log('Conectado ao banco de dados com sucesso!')

    client.release()

    global.connection = pool
    return pool
}
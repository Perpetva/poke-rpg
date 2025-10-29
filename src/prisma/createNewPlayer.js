import { prisma } from './client.js'

export async function createNewPlayer(id, phone, name) {
    const newPlayer = await prisma.jogador.create({
        data: {
            id,
            phone,
            name
        }
    })
    return newPlayer
}

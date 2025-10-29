import { prisma } from './client.js'

export async function getPlayerByIdFromDb(phone) {
    if (!phone) return null

    return prisma.jogador.findUnique({
        where: { phone }
    })
}

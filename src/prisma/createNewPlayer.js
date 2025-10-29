import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createNewPlayer(id, phone, name) {
    const newPlayer = await prisma.jogador.create({
        data: {
            id,
            phone,
            name
        }
    })

    await prisma.$disconnect()
    return newPlayer
}

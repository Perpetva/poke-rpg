import { pokemonSpawn } from "../../pokemon/pokemonSpawn.js"
import { randomNumber } from "../../utils/commonFunctions.js"

export default {
    name: 'spawn',
    description: 'Spawna um pokemon no grupo atual',
    async execute(objMessage, args, userPhone, groupId) {
        await pokemonSpawn(groupId)
    }
}
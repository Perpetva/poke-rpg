import { sendSticker } from "../../services/waha.js"
import { randomNumber } from "../../utils/commonFunctions.js"

export default {
    name: 'spawn',
    description: 'Spawna um pokemon no grupo atual',
    async execute(objMessage, args, userPhone, groupId) {
        sendSticker(groupId, randomNumber(1, 905))
    }
}
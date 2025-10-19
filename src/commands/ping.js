import { sendMessage } from '../services/zapi.js'

export default {
    name: 'ping',
    description: 'Testa o ping do bot',
    async execute(objMessage, args, userPhone, groupId) {
        sendMessage(groupId, 'pong')
    }
}
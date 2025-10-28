import { sendMessage } from '../../services/wapi.js'

export default {
    name: 'testando',
    description: 'Testa o comando de owner',
    async execute(objMessage, args, userPhone, groupId) {
        sendMessage(groupId, 'você é o owner!')
    }
}
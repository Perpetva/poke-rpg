import { sendMessage } from '../../services/wapi.js'

export default {
    name: 'teste',
    description: 'Testa o admin do bot',
    async execute(objMessage, args, userPhone, groupId) {
        sendMessage(groupId, 'você é admin!')
    }
}
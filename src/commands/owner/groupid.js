import { sendMessage } from '../../services/wapi.js'

export default {
    name: 'groupid',
    description: 'Mostra o ID do grupo atual',
    async execute(objMessage, args, userPhone, groupId) {
        console.log(`Group ID: ${groupId}`)

        await sendMessage(groupId, `ID no log lindo S2`)
    }
}
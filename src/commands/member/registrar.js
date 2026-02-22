import { sendImageWithCaption, sendMessage } from '../../services/wapi.js'
import Jogador from '../../models/Jogador.js'
import { REGISTRATION_IMAGE } from '../../pokemon/config/config.js'

export default {
    name: 'registrar',
    description: 'Registra um novo jogador',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)
        const newPlayerName = args[0]?.trim()

        if (currentPlayer) 
            return await sendMessage(groupId, `Você já está registrado como _${currentPlayer.getName()}_`)
        
        if (args.length > 1) 
            return sendMessage(groupId, 'Seu nick só pode ter uma palavra!')

        if (!newPlayerName) 
            return await sendMessage(groupId, 'Por favor, forneça um nick!')

        try {
            const newPlayer = await Jogador.createPlayer({
                id: userPhone,
                name: newPlayerName,
                phone: userPhone
            })

            const message = `✅ Registro concluído! Bem-vindo, *${newPlayer.getName()}*! Use !perfil para ver seu perfil de jogador!`

            return await sendImageWithCaption(
                groupId,
                REGISTRATION_IMAGE,
                message
            )

        } catch (e) {
            console.error('Erro registrar.js: ', e)
            return await sendMessage(groupId, '❌ Não consegui concluir seu registro agora. Tente novamente em instantes.')
        }
    }
}
import { sendMessage } from '../../services/wapi.js'
import Jogador from '../../models/Jogador.js'

export default {
    name: 'registrar',
    description: 'Registra um novo jogador',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)
        const newPlayerName = args[0]

        if (currentPlayer) 
            return sendMessage(groupId, `Você já está registrado como ${currentPlayer.getName()}`)
        
        if (args.length > 1) 
            return sendMessage(groupId, 'Seu nick só pode ter uma palavra!')

        if (!newPlayerName) 
            return sendMessage(groupId, 'Por favor, forneça um nick!')

        const newPlayer = await Jogador.registerNewPlayer(userPhone, userPhone, newPlayerName)

        sendMessage(groupId, `Olá ${newPlayer.getName()}, você foi registrado com sucesso! Boa sorte em sua jornada Pokémon!`)
    }
}
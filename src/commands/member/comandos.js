import Jogador from '../../models/Jogador.js'
import { sendMessage } from '../../services/wapi.js'

export default {
    name: 'comandos',
    description: 'Lista todos os comandos disponíveis',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)

        const commandsList = [
            '!registrar <nickname> - Registra um novo jogador com o nickname fornecido.',
            '!loja - Mostra a loja de itens disponíveis.',
            '!comprar *item* - Compra um item da loja.',
            '!pokedex - Mostra os Pokémon que você possui na Pokédex.',
            '!mudar-nome <novo nome> - Muda o nome do seu perfil.',
            '!movimentos <nome do seu pokémon> - Mostra os movimentos do Pokémon especificado.',
            '!perfil - Mostra o seu perfil com informações do jogador.',
            '!foto - Muda a foto do seu perfil.',
            '!poke <pokémon> - Mostra as informações do seu Pokémon.',
            '!vender <item> - Vende um item da sua mochila.',
            '!atacar <nome do seu pokémon> <movimento> - Ataca o Pokémon spawnado com o movimento especificado.',
            '!reviver <nome do pokémon> - Revive um Pokémon desmaiado usando um item de reanimação.',
            '!pegar <nome do pokémon> - Tenta capturar o Pokémon spawnado.',
            '!comandos - Lista todos os comandos disponíveis.',
        ]

        const formatedCommands = commandsList.map(command => `- ${command}`).join('\n\n')

        return await sendMessage(groupId, `📝 **Comandos disponíveis**:\n\n${formatedCommands}\n\n> ${currentPlayer.getName()}`)
    }
}
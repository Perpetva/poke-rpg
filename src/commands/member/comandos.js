import Jogador from '../../models/Jogador.js'
import { sendMessage } from '../../services/wapi.js'

export default {
    name: 'comandos',
    description: 'Lista todos os comandos disponíveis',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)

        if (!currentPlayer)
            return await sendMessage(groupId, '⚠️ Você precisa se registrar primeiro usando o comando !registrar *seu nick*')

        const commandsList = [
            '!registrar *seu nickname* - Registra um novo jogador com o nickname fornecido.',
            '!loja - Mostra a loja de itens disponíveis.',
            '!comprar *item* - Compra um item da loja.',
            '!pokedex - Mostra os Pokémon que você possui na Pokédex.',
            '!mudar-nome *novo nickname* - Muda o nome do seu perfil.',
            '!movimentos *nome do seu pokémon* - Mostra os movimentos do Pokémon especificado.',
            '!perfil - Mostra o seu perfil com informações do jogador.',
            '!foto - Muda a foto do seu perfil.',
            '!info *nome do pokemon* - Mostra as informações do seu Pokémon.',
            '!vender-item *item* - Vende um item da sua mochila.',
            '!vender-pokemon *nome do pokémon* - Vende um Pokémon da sua pokedex.',
            '!atacar *nome do seu pokémon* *movimento* - Ataca o Pokémon spawnado com o movimento especificado.',
            '!reviver *nome do pokémon* - Revive um Pokémon desmaiado usando um item de reanimação.',
            '!pegar *nome do pokémon* - Tenta capturar o Pokémon spawnado.',
            '!insignia *nome do pokémon* - Mostra a insígnia do jogador.',
            '!pegar *nome do pokémon* - Tenta capturar o Pokémon spawnado.',
            '!diario - Coleta a recompensa diária.'
        ]

        const formatedCommands = commandsList.map(command => `- ${command}`).join('\n\n')

        return await sendMessage(groupId, `📝 **Comandos disponíveis**:\n\n${formatedCommands}\n\n> ${currentPlayer.getName()}`)
    }
}
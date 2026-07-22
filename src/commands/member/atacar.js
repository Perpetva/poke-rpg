import { getPokemonAtual } from '../../pokemon/pokemonStructures.js'
import Jogador from '../../models/Jogador.js'

export default {
    name: 'atacar',
    description: 'Tenta atacar o pokémon spawnado',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)
        const currentPokemon = getPokemonAtual()

        if (!currentPlayer)
            return await sendMessage(groupId, '⚠️ Você precisa se registrar primeiro usando o comando !registrar *seu nick*')

        if (!currentPokemon)
            return await sendMessage(groupId, '❌ Nenhum Pokémon está spawnado no momento.')

        
    }
}
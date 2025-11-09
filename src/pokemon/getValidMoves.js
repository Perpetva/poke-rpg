import axios from 'axios'

export async function getValidMovesFromPokeAPI(pokemonId, level) {

    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        const moves = response.data.moves

        const validMoves = []
        for (const moveEntry of moves) {

            // Verifica se o move pode ser aprendido por level-up e em qual nível
            const levelUpDetails = moveEntry.version_group_details.find(
                d => d.move_learn_method.name === 'level-up' && d.level_learned_at <= level
            )

            if (!levelUpDetails) continue

            const moveDetails = await axios.get(moveEntry.move.url)
            const moveData = moveDetails.data

            if (
                moveData.power !== null && // Tem poder de ataque
                (moveData.damage_class.name === 'physical' || moveData.damage_class.name === 'special')
            ) {
                validMoves.push({
                    name: moveData.name,
                    power: moveData.power,
                    accuracy: moveData.accuracy,
                    type: moveData.type.name,
                    damageClass: moveData.damage_class.name,
                    pp: moveData.pp,
                    maxPp: moveData.pp
                });
            }

            if (validMoves.length >= 4) break // limita a 4 ataques
        }

        return validMoves

    } catch (e) {
        console.error('Erro ao buscar moves:', e)
        return []
    }
}
import { sendMessage } from '../../services/wapi.js'
import { connectToDatabase } from '../../database/connectionDatabase.js'
import Jogador from '../../models/Jogador.js'
import * as queries from '../../models/queries/queries.js'
import {
    cancelTradeSession,
    getParticipant,
    getTradeSession,
    getTradeSummary,
    getTradeTotals,
    isFinalized,
    markFinalized,
    getFinalSummary
} from '../../utils/tradeSession.js'

function getTradeOpponent(session, playerId) {
    if (session.initiator.id === playerId) return session.target
    if (session.target.id === playerId) return session.initiator

    return null
}

export default {
    name: 'finalizar',
    description: 'Finaliza a troca',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)

        if (!currentPlayer)
            return await sendMessage(groupId, '⚠️ Você precisa se registrar primeiro usando o comando !registrar *seu nick*')

        const session = getTradeSession(groupId)

        if (!session || session.status !== 'active')
            return await sendMessage(groupId, '❌ Nenhuma troca ativa neste grupo. Inicie com !trocar.')

        const participant = getParticipant(session, currentPlayer.getId())
        if (!participant)
            return await sendMessage(groupId, '❌ Você não faz parte desta troca.')

        if (isFinalized(session, currentPlayer.getId()))
            return await sendMessage(groupId, 'ℹ️ Você já finalizou esta troca. Aguarde a outra pessoa.')

        markFinalized(session, currentPlayer.getId())

        const opponent = getTradeOpponent(session, currentPlayer.getId())
        const finalizedBy = currentPlayer.getName()

        if (!isFinalized(session, session.initiator.id) || !isFinalized(session, session.target.id)) {
            return await sendMessage(groupId, `${finalizedBy} finalizou a troca, aguardando por ${opponent?.name || 'o outro jogador'}`)
        }

        const tradeTotals = getTradeTotals(session)
        const initiatorPlayer = await Jogador.getPlayerById(session.initiator.id)
        const targetPlayer = await Jogador.getPlayerById(session.target.id)

        if (!initiatorPlayer || !targetPlayer) {
            cancelTradeSession(groupId, 'invalid-player')
            return await sendMessage(groupId, '❌ Não consegui carregar os jogadores desta troca.')
        }

        const initiatorCoinDelta = tradeTotals.targetCoins - tradeTotals.initiatorCoins
        const targetCoinDelta = tradeTotals.initiatorCoins - tradeTotals.targetCoins

        if (initiatorPlayer.getPokeCoins() + initiatorCoinDelta < 0 || targetPlayer.getPokeCoins() + targetCoinDelta < 0) {
            cancelTradeSession(groupId, 'insufficient-coins')
            return await sendMessage(groupId, '❌ Um dos jogadores não tem mais moedas suficientes para concluir esta troca.')
        }

        const pool = await connectToDatabase()
        const client = await pool.connect()

        try {
            await client.query('BEGIN')

            for (const pokemonEntry of tradeTotals.initiatorPokemons) {
                const ownershipCheck = await client.query(queries.GET_PLAYER_POKEMON_BY_ID, [session.initiator.id, pokemonEntry.id])
                if (ownershipCheck.rowCount === 0) {
                    throw new Error(`Pokemon ${pokemonEntry.id} não pertence mais ao iniciador.`)
                }

                const transferResult = await client.query(queries.UPDATE_POKEMON_OWNER_BY_ID, [session.target.id, pokemonEntry.id])
                if (transferResult.rowCount === 0) {
                    throw new Error(`Falha ao transferir pokemon ${pokemonEntry.id}.`)
                }
            }

            for (const pokemonEntry of tradeTotals.targetPokemons) {
                const ownershipCheck = await client.query(queries.GET_PLAYER_POKEMON_BY_ID, [session.target.id, pokemonEntry.id])
                if (ownershipCheck.rowCount === 0) {
                    throw new Error(`Pokemon ${pokemonEntry.id} não pertence mais ao alvo.`)
                }

                const transferResult = await client.query(queries.UPDATE_POKEMON_OWNER_BY_ID, [session.initiator.id, pokemonEntry.id])
                if (transferResult.rowCount === 0) {
                    throw new Error(`Falha ao transferir pokemon ${pokemonEntry.id}.`)
                }
            }

            const nextInitiatorCoins = initiatorPlayer.getPokeCoins() + initiatorCoinDelta
            const nextTargetCoins = targetPlayer.getPokeCoins() + targetCoinDelta

            const initiatorCoinResult = await client.query(queries.UPDATE_PLAYER_POKE_COINS, [nextInitiatorCoins, session.initiator.id])
            if (initiatorCoinResult.rowCount === 0) {
                throw new Error('Falha ao atualizar as moedas do iniciador.')
            }

            const targetCoinResult = await client.query(queries.UPDATE_PLAYER_POKE_COINS, [nextTargetCoins, session.target.id])
            if (targetCoinResult.rowCount === 0) {
                throw new Error('Falha ao atualizar as moedas do alvo.')
            }

            await client.query('COMMIT')
        } catch (error) {
            await client.query('ROLLBACK')

            cancelTradeSession(groupId, 'failed-settlement')

            console.error('Erro ao finalizar troca:', error)
            return await sendMessage(groupId, '❌ Não consegui concluir a troca. A sessão foi cancelada.')

        } finally {
            client.release()
        }

        cancelTradeSession(groupId, 'completed')

        return await sendMessage(
            groupId,
            `Ambos finalizaram a troca:\n${getFinalSummary(session)}`
        )
    }
}
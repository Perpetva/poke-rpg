import { sendMessage } from '../../services/wapi.js'
import Jogador from '../../models/Jogador.js'
import {
    getParticipant,
    getTradeSession,
    getTradeSummary,
    removeOfferEntry
} from '../../utils/tradeSession.js'

export default {
    name: 'remover',
    description: 'Remove algo da troca',
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

        const tradeToken = args.join(' ').trim()
        if (!tradeToken)
            return await sendMessage(groupId, '⚠️ Indique o pokemon ou a quantidade de moedas que deseja remover.')

        const removedEntry = removeOfferEntry(session, currentPlayer.getId(), tradeToken)
        if (!removedEntry)
            return await sendMessage(groupId, '❌ Não encontrei esse item na sua oferta.')

        const removedMessage = removedEntry.type === 'pokemon'
            ? `o pokemon ${removedEntry.name} foi removido da troca`
            : `as moedas $${removedEntry.amount} foram removidas da troca`

        return await sendMessage(
            groupId,
            `${removedMessage}\n\n${getTradeSummary(session)}`
        )
    }
}
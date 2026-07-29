import { sendMessage } from '../../services/wapi.js'
import Jogador from '../../models/Jogador.js'
import {
	activateTradeSession,
	createSessionFromPlayers,
	getTradeSession,
	getTradeSummary
} from '../../utils/tradeSession.js'

async function resolvePlayerByReference(reference) {
	const normalizedReference = String(reference || '').trim()
	if (!normalizedReference) return null

	const byId = await Jogador.getPlayerById(normalizedReference)
	if (byId) return byId

	return Jogador.getPlayerByName(normalizedReference)
}

export default {
	name: 'trocar',
	description: 'Inicia ou aceita uma troca',
	async execute(objMessage, args, userPhone, groupId) {
		const currentPlayer = await Jogador.getPlayerById(userPhone)

		if (!currentPlayer)
			return await sendMessage(groupId, '⚠️ Você precisa se registrar primeiro usando o comando !registrar *seu nick*')

		const playerName = args.join(' ').trim()
		if (!playerName)
			return await sendMessage(groupId, '⚠️ Indique com quem você quer trocar. Exemplo: _!trocar <nome_do_jogador>_')

		const currentSession = getTradeSession(groupId)
		const currentPlayerId = currentPlayer.getId()
		const normalizedName = playerName.toLowerCase()

		if (!currentSession) {
			const targetPlayer = await Jogador.getPlayerByName(normalizedName)

			if (!targetPlayer)
				return await sendMessage(groupId, `❌ Não encontrei nenhum jogador chamado ${normalizedName}.`)

			if (targetPlayer.getId() === currentPlayerId)
				return await sendMessage(groupId, '❌ Você não pode iniciar uma troca consigo mesmo.')

			createSessionFromPlayers(groupId, currentPlayer, targetPlayer)

			return await sendMessage(
				groupId,
				`@${targetPlayer.getPhone()}, ${currentPlayer.getName()} quer trocar com você, digite !trocar ${currentPlayer.getName()} para prosseguir.`
			)
		}

		const isPendingSession = currentSession.status === 'pending'
		const currentParticipant = currentSession.initiator.id === currentPlayerId || currentSession.target.id === currentPlayerId

		if (!currentParticipant)
			return await sendMessage(groupId, '❌ Já existe uma troca em andamento neste grupo.')

		if (!isPendingSession)
			return await sendMessage(groupId, `❌ A troca já está ativa. Use !adicionar, !remover ou !finalizar.\n\n${getTradeSummary(currentSession)}`)

		const initiatorName = currentSession.initiator.name
		const targetName = currentSession.target.name

		const canAccept = currentPlayerId === currentSession.target.id && normalizedName === initiatorName.toLowerCase()
		const canReopen = currentPlayerId === currentSession.initiator.id && normalizedName === targetName.toLowerCase()

		if (!canAccept && !canReopen) {
			return await sendMessage(
				groupId,
				`❌ Troca pendente entre ${initiatorName} e ${targetName}.\n\n${currentPlayerId === currentSession.initiator.id ? `Aguardando ${targetName} responder com !trocar ${initiatorName}.` : `Aguardando ${initiatorName} confirmar com !trocar ${targetName}.`}`
			)
		}

		if (canReopen) 
			return await sendMessage(groupId, `ℹ️ O pedido já está aberto para ${targetName}. Aguarde a confirmação.`)

		activateTradeSession(currentSession)

		return await sendMessage(
			groupId,
			`Uma troca foi iniciada entre ${currentSession.initiator.name} e ${currentSession.target.name}.\n\nUse !adicionar para adicionar um pokemon ou moedas.\n\n${getTradeSummary(currentSession)}`
		)
	}
}

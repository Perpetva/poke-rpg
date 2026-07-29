import { sendMessage } from '../../services/wapi.js'
import Jogador from '../../models/Jogador.js'
import { firstLetterUpperCase } from '../../utils/commonFunctions.js'
import {
    addCoinOffer,
    addPokemonOffer,
    getParticipant,
    getTradeSession,
    getTradeSummary,
    getTradeTotals
} from '../../utils/tradeSession.js'

function formatAddedEntry(entry) {
    if (!entry) return null

    if (entry.type === 'pokemon') return `o pokemon ${entry.name} foi adicionado a troca`
    if (entry.type === 'coins') return `_*$${entry.amount}* moedas foram adicionadas a troca!_`

    return null
}

export default {
    name: 'adicionar',
    description: 'Adiciona algo a troca',
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
            return await sendMessage(groupId, '⚠️ Indique o pokemon ou a quantidade de moedas que deseja adicionar.')

        const normalizedToken = tradeToken.trim()
        const parsedAmount = Number(normalizedToken)

        let addedEntry = null

        if (Number.isFinite(parsedAmount) && parsedAmount > 0) {
            const tradeTotals = getTradeTotals(session)
            const currentOfferCoins = currentPlayer.getId() === session.initiator.id ? tradeTotals.initiatorCoins : tradeTotals.targetCoins

            if (currentPlayer.getPokeCoins() < currentOfferCoins + parsedAmount)
                return await sendMessage(groupId, `❌ Você não possui ${parsedAmount} PokéCoins disponíveis para essa troca.`)

            addedEntry = addCoinOffer(session, currentPlayer.getId(), parsedAmount)
        } else {
            const pokemon = await currentPlayer.getPokemonByName(tradeToken)

            if (!pokemon)
                return await sendMessage(groupId, `❌ Você não possui o pokemon ${tradeToken}.`)

            addedEntry = addPokemonOffer(session, currentPlayer.getId(), (pokemon))

            if (!addedEntry)
                return await sendMessage(groupId, `❌ O pokemon ${pokemon.getName()} já está na sua oferta.`)
        }

        if (!addedEntry)
            return await sendMessage(groupId, '❌ Não consegui adicionar esse item à troca.')

        return await sendMessage(
            groupId,
            `${formatAddedEntry(addedEntry)}\n\n${getTradeSummary(session)}`
        )
    }
}
const TRADE_TIMEOUT_MS = 3 * 60 * 1000

const tradeSessions = new Map()

function normalizeText(value) {
    return String(value || '').trim().toLowerCase()
}

function normalizeToken(value) {
    return String(value || '').trim().replace(/^\$/, '')
}

function createEmptyOffer() {
    return {
        entries: [],
        finalized: false
    }
}

function createParticipantSnapshot(player) {
    return {
        id: player.getId(),
        name: player.getName(),
        phone: player.getPhone()
    }
}

function getOffer(session, playerId) {
    return session?.offers?.get(playerId) || null
}

function getParticipant(session, playerId) {
    if (!session) return null

    if (session.initiator.id === playerId) return session.initiator
    if (session.target.id === playerId) return session.target

    return null
}

function formatOfferEntries(entries) {
    if (!Array.isArray(entries) || entries.length === 0) return 'nada'

    return entries.map(entry => {
        if (entry.type === 'pokemon') return entry.name
        if (entry.type === 'coins') return `$${entry.amount}`

        return ''
    }).filter(Boolean).join(', ')
}

function sumCoinEntries(entries) {
    return (Array.isArray(entries) ? entries : []).reduce((total, entry) => {
        if (entry.type !== 'coins') return total

        return total + Number(entry.amount || 0)
    }, 0)
}

function listPokemonEntries(entries) {
    return (Array.isArray(entries) ? entries : []).filter(entry => entry.type === 'pokemon')
}

function listCoinEntries(entries) {
    return (Array.isArray(entries) ? entries : []).filter(entry => entry.type === 'coins')
}

function createSessionFromPlayers(groupId, initiator, target) {
    const session = {
        groupId,
        status: 'pending',
        initiator: createParticipantSnapshot(initiator),
        target: createParticipantSnapshot(target),
        offers: new Map([
            [initiator.getId(), createEmptyOffer()],
            [target.getId(), createEmptyOffer()]
        ]),
        createdAt: Date.now(),
        expiresAt: Date.now() + TRADE_TIMEOUT_MS,
        timeoutId: null
    }

    session.timeoutId = setTimeout(() => {
        cancelTradeSession(groupId, 'timeout')
    }, TRADE_TIMEOUT_MS)

    tradeSessions.set(groupId, session)
    return session
}

function getTradeSession(groupId) {
    const session = tradeSessions.get(groupId)
    if (!session) return null

    if (session.expiresAt <= Date.now()) {
        cancelTradeSession(groupId, 'timeout')
        return null
    }

    return session
}

function cancelTradeSession(groupId, reason = 'manual') {
    const session = tradeSessions.get(groupId)
    if (!session) return null

    if (session.timeoutId) {
        clearTimeout(session.timeoutId)
    }

    tradeSessions.delete(groupId)

    return {
        ...session,
        cancelReason: reason
    }
}

function activateTradeSession(session) {
    if (!session) return null

    session.status = 'active'
    return session
}

function resetFinalizations(session) {
    if (!session?.offers) return

    for (const offer of session.offers.values()) {
        offer.finalized = false
    }
}

function markFinalized(session, playerId) {
    const offer = getOffer(session, playerId)
    if (!offer) return null

    offer.finalized = true
    return offer.finalized
}

function isFinalized(session, playerId) {
    const offer = getOffer(session, playerId)
    return Boolean(offer?.finalized)
}

function addPokemonOffer(session, playerId, pokemon) {
    const offer = getOffer(session, playerId)
    if (!offer || !pokemon) return null

    const alreadyOffered = offer.entries.some(entry => entry.type === 'pokemon' && entry.id === pokemon.id)
    if (alreadyOffered) return null

    offer.entries.push({
        type: 'pokemon',
        id: pokemon.id,
        name: pokemon.getName()
    })

    resetFinalizations(session)
    return offer.entries[offer.entries.length - 1]
}

function addCoinOffer(session, playerId, amount) {
    const offer = getOffer(session, playerId)
    const parsedAmount = Math.max(0, Math.floor(Number(amount)))

    if (!offer || !Number.isFinite(parsedAmount) || parsedAmount <= 0) return null

    offer.entries.push({
        type: 'coins',
        amount: parsedAmount
    })

    resetFinalizations(session)
    return offer.entries[offer.entries.length - 1]
}

function removeOfferEntry(session, playerId, token) {
    const offer = getOffer(session, playerId)
    if (!offer) return null

    const normalizedToken = normalizeToken(token)
    if (!normalizedToken) return null

    const numericToken = Number(normalizedToken)
    const isCoinToken = Number.isFinite(numericToken) && numericToken > 0

    const entryIndex = offer.entries.findIndex(entry => {
        if (isCoinToken) {
            return entry.type === 'coins' && Number(entry.amount) === numericToken
        }

        return entry.type === 'pokemon' && normalizeText(entry.name) === normalizeText(normalizedToken)
    })

    if (entryIndex === -1) return null

    const [removedEntry] = offer.entries.splice(entryIndex, 1)
    resetFinalizations(session)

    return removedEntry
}

function getTradeSummary(session) {
    if (!session) return ''

    const initiatorOffer = getOffer(session, session.initiator.id)
    const targetOffer = getOffer(session, session.target.id)

    return [
        'Status:',
        `${session.initiator.name}: ${formatOfferEntries(initiatorOffer?.entries)}`,
        `${session.target.name}: ${formatOfferEntries(targetOffer?.entries)}`,
        '',
        'para finalizar a troca escreva !finalizar.',
        '> A troca é cancelada em 3 minutos',
    ].join('\n')
}

function getFinalSummary(session) {
    if (!session) return ''

    const initiatorOffer = getOffer(session, session.initiator.id)
    const targetOffer = getOffer(session, session.target.id)

    return [
        'Status:',
        `${session.initiator.name}: ${formatOfferEntries(initiatorOffer?.entries)}`,
        `${session.target.name}: ${formatOfferEntries(targetOffer?.entries)}`,
        '',
        'A troca foi finalizada com sucesso! ✅',
    ].join('\n')
}

function getTradeTotals(session) {
    const initiatorOffer = getOffer(session, session.initiator.id)
    const targetOffer = getOffer(session, session.target.id)

    return {
        initiatorCoins: sumCoinEntries(initiatorOffer?.entries),
        targetCoins: sumCoinEntries(targetOffer?.entries),
        initiatorPokemons: listPokemonEntries(initiatorOffer?.entries),
        targetPokemons: listPokemonEntries(targetOffer?.entries),
        initiatorCoinEntries: listCoinEntries(initiatorOffer?.entries),
        targetCoinEntries: listCoinEntries(targetOffer?.entries)
    }
}

export {
    TRADE_TIMEOUT_MS,
    activateTradeSession,
    addCoinOffer,
    addPokemonOffer,
    cancelTradeSession,
    createSessionFromPlayers,
    getParticipant,
    getTradeSession,
    getTradeSummary,
    getTradeTotals,
    isFinalized,
    markFinalized,
    removeOfferEntry,
    getFinalSummary
}
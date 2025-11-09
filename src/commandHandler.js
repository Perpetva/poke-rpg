import fs from 'fs'
import { searchGroupAdmins } from './utils/groupController.js'
import { sendMessage } from './services/waha.js'
import { normalizeNumber } from './utils/commonFunctions.js'
import 'dotenv/config'


export async function commandHandler(objMessage) {
    const commands = new Map()

    // Carrega comandos conforme o diretório e role
    const loadRoleCommands = async (role) => {
        const dir = `./src/commands/${role}`
        if (!fs.existsSync(dir)) return
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'))
        for (const file of files) {
            const mod = (await import(`./commands/${role}/${file}`)).default
            if (!mod?.name || typeof mod?.execute !== 'function') continue
            commands.set(mod.name.toLowerCase(), { ...mod, role })
        }
    }

    await loadRoleCommands('member')
    await loadRoleCommands('admin')
    await loadRoleCommands('owner')

    const payload = objMessage.payload || {}
    const text = payload.body || ''
    const from = payload.from || ''
    const participant = payload.participant || payload.from
    const isGroup = from.endsWith('@g.us')
    const fromMe = payload.fromMe
    const groupId = isGroup ? from : null

    if (fromMe) return
    if (!isGroup) return
    if (!text.startsWith('!')) return

    const args = text.slice(1).trim().split(/ +/)
    const commandName = (args.shift() || '').toLowerCase()
    if (!commandName) return

    const command = commands.get(commandName)
    if (!command) return

    const role = command.role || 'member'

    let groupParticipants = []
    let groupOwnerJid = ''
    if (role === 'admin') {
        const response = await searchGroupAdmins(groupId)
        const rawList = (response && (response.Participants || response.participants)) || []

        groupParticipants = Array.isArray(rawList) ? rawList : []
        groupOwnerJid = response?.OwnerJID || response?.ownerJid || ''
    }

    const participantList = Array.isArray(groupParticipants) ? groupParticipants : []

    const standardized = participantList.map(p => {
        const id = p?.JID || p?.LID || p?.id || p?.jid || ''
        const isAdminFlag = p?.IsAdmin || p?.IsSuperAdmin || p?.isAdmin || p?.isSuperAdmin || false

        return { id, isAdmin: Boolean(isAdminFlag) }
    })

    const adminNumbers = new Set(
        standardized
            .filter(p => p.isAdmin)
            .map(p => normalizeNumber(p.id))
    )

    if (groupOwnerJid) {
        const n = normalizeNumber(groupOwnerJid)
        if (n) adminNumbers.add(n)
    }

    const userNumber = normalizeNumber(participant)
    const ownerRaw = process.env.OWNER_LID || process.env.OWNER_NUMBER || process.env.OWNER || ''
    const ownerNumber = normalizeNumber(ownerRaw)
    const isAdmin = adminNumbers.has(userNumber)
    const isOwner = ownerNumber && ownerNumber === userNumber

    const canExecute = (() => {
        if (role === 'member') return true
        if (role === 'admin') return isAdmin
        if (role === 'owner') return isOwner
        return false
    })()

    if (!canExecute) {
        await sendMessage(groupId, '🚫 Você não tem permissão para usar este comando.')
        return
    }

    setTimeout(async () => {
        try {
            await command.execute(objMessage, args, userNumber, groupId)
        } catch (e) {
            console.error(`Erro ao executar o comando ${commandName}:`, e)
        }
    }, 400)
}
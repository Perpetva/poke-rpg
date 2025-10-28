import fs from 'fs'
import { searchGroupAdmins } from './utils/groupController.js'
import { sendMessage } from './services/wapi.js'
import { normalizeNumber } from './utils/commonFunctions.js'
import 'dotenv/config'

export async function commandHandler(objMessage) {
    const commands = new Map()

    // Helper para carregar comandos por diretório (member/admin/owner)
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

    const text = objMessage.msgContent?.conversation || ''
    const rawSenderId = objMessage.sender?.id || ''
    const userPhone = rawSenderId.split(':')[0]
    const groupId = objMessage.chat?.id

    if (objMessage.fromMe) return
    if (!objMessage.isGroup) return
    if (!text.startsWith('!')) return

    const args = text.slice(1).trim().split(/ +/)
    const commandName = (args.shift() || '').toLowerCase()
    if (!commandName) return

    const command = commands.get(commandName)
    if (!command) return

    const role = command.role || 'member'

    let groupParticipants = []
    if (role === 'admin') {
        const response = await searchGroupAdmins(groupId)
        if (response && response.participants) {
            groupParticipants = response.participants
        }
    }

    const participantList = Array.isArray(groupParticipants) ? groupParticipants : []
    const adminNumbers = new Set(
        participantList
            .filter(p => ['admin', 'superadmin'].includes((p?.admin || '').toLowerCase()))
            .map(p => normalizeNumber(p.id))
    )

    const userNumber = normalizeNumber(rawSenderId)
    const ownerNumber = normalizeNumber(process.env.OWNER_NUMBER)
    const isAdmin = adminNumbers.has(userNumber)
    const isOwner = ownerNumber && ownerNumber === userNumber

    const canExecute = (() => {
        if (role === 'member') return true
        if (role === 'admin') return isAdmin
        if (role === 'owner') return isOwner

        return false
    })()

    if (!canExecute) {
        await sendMessage(groupId, 'Você não tem permissão para usar este comando.')
        return
    }

    setTimeout(async () => {
        try {
            await command.execute(objMessage, args, userPhone, groupId)
        } catch (e) {
            console.error(`Erro ao executar o comando ${commandName}:`, e)
        }
    }, 400)
}
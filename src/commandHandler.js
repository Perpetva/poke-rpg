import fs from 'fs'

export async function commandHandler(objMessage) {
    const commands = new Map()
    const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))

    for (const file of commandFiles) {
        const command = (await import(`./commands/${file}`)).default
        commands.set(command.name, command)
    }

    const text = objMessage.msgContent.conversation
    const userPhone = objMessage.sender.id.split(':')[0] 
    const groupId = objMessage.chat.id

    if (objMessage.fromMe) return
    if (!objMessage.isGroup) return
    if (!text.startsWith('!')) return
    
    const args = text.slice(1).trim().split(/ +/)
    const commandName = args.shift().toLowerCase()
    const command = commands.get(commandName)

    if (!command) return

    try {
        setTimeout(() => {
            command.execute(objMessage, args, userPhone, groupId)
        }, 400)

    } catch (e) {
        console.error(`Erro ao executar o comando ${commandName}:`, e)
    }
}
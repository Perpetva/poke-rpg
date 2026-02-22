export function normalizeNumber(value = '') {
    if (typeof value !== 'string') return ''
    
    const match = value.match(/(\d{6,15})(?=@|$)/g)
    if (!match) return ''
    
    return match.pop()
}

export function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function extractImageMessageMetadata(objMessage) {
    const msgContent = objMessage?.msgContent || {}

    const imageMessage =
        msgContent.imageMessage ||
        objMessage?.imageMessage ||
        objMessage?.message?.imageMessage ||
        null

    if (!imageMessage) return null

    return {
        mediaKey: imageMessage.mediaKey,
        directPath: imageMessage.directPath,
        type: imageMessage.type || 'image',
        mimetype: imageMessage.mimetype
    }
}

export function firstLetterUpperCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
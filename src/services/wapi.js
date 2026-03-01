import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

const SUPPORTED_IMAGE_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/jpg'])

function normalizeImageMimeType(mimetype) {
    if (!mimetype) return null

    const normalizedMimeType = String(mimetype).toLowerCase().trim()
    if (normalizedMimeType === 'image/jpg') return 'image/jpeg'

    return SUPPORTED_IMAGE_MIME_TYPES.has(normalizedMimeType) ? normalizedMimeType : null
}

function inferImageMimeTypeFromBuffer(buffer) {
    if (!buffer || buffer.length < 4) return 'image/jpeg'

    const pngSignature = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47
    if (pngSignature) return 'image/png'

    const jpegSignature = buffer[0] === 0xff && buffer[1] === 0xd8
    if (jpegSignature) return 'image/jpeg'

    return 'image/jpeg'
}

export async function sendMessage(phone, message) {
    if (!phone || !message) {
        console.error('sendMessage: phone ou message está vazio!')
        return
    }

    const instanceId = process.env.WAPI_INSTANCE_ID
    const token = process.env.WAPI_TOKEN

    const url = `https://api.w-api.app/v1/message/send-text?instanceId=${instanceId}`

    try {
        const response = await axios.post(
            url,
            { phone, message },
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                timeout: 10000
            }
        )

    } catch (e) {
        console.error("Erro ao enviar mensagem via WAPI:", e)
    }
}

export async function sendSticker(phone, randomId) { // arrumar para sendPokemonSticker
    if (!phone || !randomId) {
        console.error('sendSticker: phone ou stickerId está vazio!')
        return
    }

    const sticker = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${randomId}.png`

    const instanceId = process.env.WAPI_INSTANCE_ID
    const token = process.env.WAPI_TOKEN

    const url = `https://api.w-api.app/v1/message/send-sticker?instanceId=${instanceId}`

    try {
        const response = await axios.post(
            url,
            { phone, sticker },
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                timeout: 10000
            }
        )

    } catch (e) {
        console.error("Erro ao enviar sticker via WAPI:", e)
    }
}

export async function sendStickerBadge(phone, urlSticker) { // mudar para uma func sendSticker default
    if (!phone || !urlSticker) {
        console.error('sendStickerBadge: phone ou stickerUrl está vazio!')
        return
    }

    const sticker = urlSticker

    const instanceId = process.env.WAPI_INSTANCE_ID
    const token = process.env.WAPI_TOKEN

    const url = `https://api.w-api.app/v1/message/send-sticker?instanceId=${instanceId}`

    try {
        const response = await axios.post(
            url,
            { phone, sticker },
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                timeout: 10000
            }
        )

    } catch (e) {
        console.error("Erro ao enviar sticker via WAPI:", e)
    }
}

export async function sendImageWithCaption(phone, image, caption) {
    if (!phone || !image || !caption) {
        console.error('sendImageWithCaption: phone, image ou caption está vazio!')
        return
    }

    const instanceId = process.env.WAPI_INSTANCE_ID
    const token = process.env.WAPI_TOKEN

    const url = `https://api.w-api.app/v1/message/send-image?instanceId=${instanceId}`

    try {
        const response = await axios.post(
            url,
            { phone, image, caption },
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                timeout: 10000
            }
        )
    } catch (e) {
        console.error("Erro ao enviar imagem com legenda via WAPI:", e)
    }
}

export function imageBufferToBase64DataUri(buffer, mimeType) {
    if (!buffer) return null

    const validMimeType = normalizeImageMimeType(mimeType) || inferImageMimeTypeFromBuffer(buffer)
    const base64Image = Buffer.from(buffer).toString('base64')

    return `data:${validMimeType};base64,${base64Image}`
}

export async function downloadImageMedia({ mediaKey, directPath, type, mimetype }) {
    const validMimeType = normalizeImageMimeType(mimetype)
    if (!mediaKey || !directPath || type !== 'image' || !validMimeType) {
        throw new Error('Metadados da imagem inválidos para download.')
    }

    const instanceId = process.env.WAPI_INSTANCE_ID
    const token = process.env.WAPI_TOKEN

    const url = `https://api.w-api.app/v1/message/download-media?instanceId=${instanceId}`

    const { data } = await axios.post(
        url,
        { mediaKey, directPath, type, mimetype: validMimeType },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000
        }
    )

    if (!data || data.error || !data.fileLink) {
        throw new Error('Não foi possível obter o link da mídia na W-API.')
    }

    const mediaResponse = await axios.get(data.fileLink, {
        responseType: 'arraybuffer',
        timeout: 10000
    })

    return {
        imageBuffer: Buffer.from(mediaResponse.data),
        mimeType: validMimeType
    }
}
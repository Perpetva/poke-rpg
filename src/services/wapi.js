import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

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

export async function sendSticker(phone, randomId) {
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
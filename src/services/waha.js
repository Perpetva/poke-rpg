import axios from "axios"
import dotenv from "dotenv"
import sharp from "sharp"
dotenv.config()

export async function sendMessage(chatId, message) {
    if (!chatId || !message) {
        console.error("sendMessage: phone ou message está vazio!")
        return
    }

    const apiUrl = process.env.WAHA_URL || "http://localhost:3000"
    const apiKey = process.env.WAHA_API_KEY
    const session = process.env.WAHA_SESSION

    const url = `${apiUrl}/api/sendText`

    try {
        const response = await axios.post(
            url,
            {
                session,
                chatId,
                text: message
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(apiKey && { "X-Api-Key": apiKey })
                },
                timeout: 10000
            }
        )

        // console.log("✅ Mensagem enviada via WAHA:", response.data)

        return response.data

    } catch (e) {
        console.error("❌ Erro ao enviar mensagem via WAHA:", e.message)
    }
}


export async function sendSticker(chatId, randomId) {
    if (!chatId || !randomId) {
        console.error("sendSticker: chatId ou randomId está vazio!")
        return
    }

    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${randomId}.png`

    const res = await axios.get(spriteUrl, { responseType: 'arraybuffer' });
    const imagem = Buffer.from(res.data);

    const webp = await sharp(imagem)
        .resize(512, 512, { fit: "contain" })
        .webp()
        .toBuffer();

    const apiUrl = process.env.WAHA_URL
    const apiKey = process.env.WAHA_API_KEY
    const session = process.env.WAHA_SESSION

    const url = `${apiUrl}/api/sendFile`

    try {
        const response = await axios.post(
            url,
            {
                session,
                chatId,
                file: webp,
                mimetype: "image/webp", // tipo correto do sticker
                filename: "sticker.webp"
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(apiKey && { "X-Api-Key": apiKey })
                },
                timeout: 15000
            }
        )

        console.log("✅ Figurinha enviada via WAHA:", response.data)
        return response.data

    } catch (e) {
        console.error("❌ Erro ao enviar figurinha via WAHA:", e)
    }
}
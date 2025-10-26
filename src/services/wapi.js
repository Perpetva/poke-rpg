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

        console.log("Resposta WAPI:", response.data)

    } catch (e) {
        console.error("Erro ao enviar mensagem via WAPI:", e)
    }
}
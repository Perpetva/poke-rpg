import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

export async function sendMessage(phone, message) {
    if (!phone) {
        console.error('sendMessage: phone está vazio!')
        return
    }
    
    const instanceId = process.env.ZAPI_INSTANCE_ID
    const token = process.env.ZAPI_TOKEN
    const securityToken = process.env.ZAPI_SECURITY_TOKEN

    const url = `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`

    try {
        const response = await axios.post(
            url,
            { phone, message },
            {
                headers: {
                    "client-token": securityToken,
                    "Content-Type": "application/json"
                },
                timeout: 10000
            }
        )

        console.log("Resposta Z-API:", response.data)

    } catch (e) {
        console.error("Erro ao enviar mensagem via Z-API:", e)
    }
}
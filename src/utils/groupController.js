import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

export async function searchGroupAdmins(groupId) {
    if (!groupId) {
        console.error('groupId está vazio!')
        return null
    }

    const apiUrl = process.env.WAHA_URL || "http://localhost:3000"
    const apiKey = process.env.WAHA_API_KEY 
    const session = process.env.WAHA_SESSION 

    const url = `${apiUrl}/api/${session}/groups/${groupId}`

    try {
        const response = await axios.get(url, {
            headers: {
                "accept": "application/json",
                ...(apiKey && { "X-Api-Key": apiKey })
            },
            timeout: 10000
        })

        console.log("📋 INFO DO GRUPO:", response.data)
        return response.data

    } catch (e) {
        console.error("❌ Erro ao buscar administradores do grupo:", e.message)
        return null
    }
}
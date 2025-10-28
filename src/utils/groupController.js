import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

export async function searchGroupAdmins(groupId) {
    if (!groupId) {
        console.error('groupId está vazio!')
        return null
    }

    const instanceId = process.env.WAPI_INSTANCE_ID
    const token = process.env.WAPI_TOKEN

    const url = `https://api.w-api.app/v1/group/get-Participants?instanceId=${instanceId}&groupId=${groupId}`

    try {
        const response = await axios.get(
            url,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                timeout: 10000
            }
        )

        console.log("RESPONSE DO GRUPO: ", response.data)
        return response.data

    } catch (e) {
        console.error("Erro ao buscar administradores do grupo:", e)
        return null
    }
}
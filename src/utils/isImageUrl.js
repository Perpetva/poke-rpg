import axios from "axios"

export async function isImageUrl(url) {
    const imageExtensions = ['.jpg', '.jpeg', '.png']

    console.log('ENTROU NO IMAGEURL')

    try {
        const parsedUrl = new URL(url)
        const hasImageExtension = imageExtensions.some(ext => parsedUrl.pathname.endsWith(ext))
        if (!hasImageExtension) return false

        const response = await axios.head(url)
        const contentType = response.headers['content-type']

        return contentType && contentType.startsWith('image/')

    } catch (e) {
        console.log('Erro ao verificar URL de imagem: ', e)
        return false
    }
}
import { sendMessage, sendSticker } from '../../services/wapi.js'
import Jogador from '../../models/Jogador.js'
import { translatePokemonTypes, getHeightAndWeightById, verifyGenerationById, getPokemonTypesById } from '../../pokemon/commonPokemonFunctions.js'

export default {
    name: 'info',
    description: 'Exibe informações sobre o pokemon do jogador',
    async execute(objMessage, args, userPhone, groupId) {
        const currentPlayer = await Jogador.getPlayerById(userPhone)
        const pokemonName = args[0]?.trim()

        if (!currentPlayer)
            return await sendMessage(groupId, '⚠️ Você precisa se registrar primeiro usando o comando !registrar *seu nick*')

        if (!pokemonName)
            return await sendMessage(groupId, 'Por favor, forneça o nome do pokemon! Exemplo: !movimentos pikachu')

        const currentPokemon = await currentPlayer.getPokemonByName(pokemonName)
        if (!currentPokemon)
            return await sendMessage(groupId, `❌ Você não possui um pokemon com o nome ${pokemonName}!`)

        const specieId = currentPokemon.getSpecieId()
        const sellPrice = currentPokemon.getPrice()
        const { height, weight } = await getHeightAndWeightById(specieId)
        const ownerName = currentPlayer.getName()
        const pokemonTypes = await getPokemonTypesById(specieId)

        const info =
            `📘 Informações do Pokémon:\n\n` +
            `🧬 Nome: ${currentPokemon.getName()}\n` +
            `🔢 Nível: ${currentPokemon.getLevel()}\n` +
            `♟️ Experiência: ${currentPokemon.getCurrentExperience()}/${currentPokemon.getTotalLvlExperience()}\n` +
            `❤️ HP: ${currentPokemon.getCurrentHp()}/${currentPokemon.getCurrentHp()}\n` + // Trocar para HP máximo quando implementar
            `🆔 ID: ${specieId}\n` +
            `👤 Dono: ${ownerName}\n\n` +

            `⚡️ Tipo(s): ${translatePokemonTypes(pokemonTypes)}\n` +
            `📏 Altura: ${height} m\n` +
            `⚖️ Peso: ${weight} kg\n` +
            `🗓️ Geração: ${verifyGenerationById(specieId)}\n\n` +
            `💸 Preço de venda: ${sellPrice} PokéCoins\n\n` +

            `🌟 IVs:\n` +
            `❤️ HP: ${currentPokemon.iv.hp}\n` +
            `⚔️ Ataque: ${currentPokemon.iv.attack}\n` +
            `🛡️ Defesa: ${currentPokemon.iv.defense}\n` +
            `🔮 Sp. Ataque: ${currentPokemon.iv.specialAttack}\n` +
            `🌀 Sp. Defesa: ${currentPokemon.iv.specialDefense}\n` +
            `💨 Velocidade: ${currentPokemon.iv.speed}\n`

        await sendMessage(groupId, info)
        await sendSticker(groupId, specieId)
    }
}
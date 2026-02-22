import { POKEBALL_PRICE, POTION_PRICE, REVIVE_PRICE, RARE_CANDY_PRICE, FULL_RESTORE_PRICE, CHANGE_NAME_PRICE } from '../pokemon/config/prices.js'

export async function perfilMessage(currentPlayer) {
    const pokedex = await currentPlayer.getPokedex()

    return `\n⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘\n\n` +

        `˗ˏˋ *「 ✦ ${currentPlayer.getName()} ✦ 」* ˎˊ˗\n\n` +

        `∘₊✧──────✧₊∘\n\n` +

        `💰: ${currentPlayer.getPokeCoins()} _PokéCoins_\n\n` +

        `∘₊✧──────✧₊∘\n\n` +

        `🎒 𝕀𝕟𝕧𝕖𝕟𝕥𝕒𝕣𝕚𝕠 🎒\n` +
        `🪼 _Pokemons_: ${pokedex.length}\n` +
        `🔮 _Pokebolas_: ${currentPlayer.getPokebola()}\n` +
        `🧪 _Poções_: ${currentPlayer.getPocao()}\n` +
        `🧬 _Revives_: ${currentPlayer.getReviver()}\n` +
        `⚱️ _Curas totais_: ${currentPlayer.getCuraTotal()}\n` +
        `🍬 _Doces raros_: ${currentPlayer.getDoceRaro()}\n\n` +

        `⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘\n`
}

export function storeMessage (currentPlayer) {
    return `🛒 *_POKE MART_* 🛒\n\n` +

    `🎯 *Captura*\n` +
    `1️⃣ _Pokebola_ - ${POKEBALL_PRICE} PokéCoins\n\n` +

    `🩺 *Cura*\n` +
    `1️⃣ _Poção_ - ${POTION_PRICE} PokéCoins\n` +
    `2️⃣ _Reviver_ - ${REVIVE_PRICE} PokéCoins\n` +
    `3️⃣ _Cura total_ - ${FULL_RESTORE_PRICE} PokéCoins\n\n` +

    `🧠 Melhoria\n` +
    `1️⃣ _Doce raro_ - ${RARE_CANDY_PRICE} PokéCoins\n\n` +

    `📝 Personalização\n` +
    `1️⃣ _Mudar nome_ - ${CHANGE_NAME_PRICE} PokéCoins\n\n` +

    `💰 _Seu saldo_: ${currentPlayer.getPokeCoins()} PokéCoins\n\n` +

    `Use o comando !comprar *nome do item* para comprar um item.\n\n` +

    `> ${currentPlayer.getName()}`
}
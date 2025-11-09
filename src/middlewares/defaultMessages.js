export function perfilMessage(currentPlayer) {
    return `\n⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘\n\n` +

        `˗ˏˋ *「 ✦ ${currentPlayer.getName()} ✦ 」* ˎˊ˗\n\n` +

        `∘₊✧──────✧₊∘\n\n` +

        `💰: ${currentPlayer.getPokeCoins()} _PokéCoins_\n\n` +

        `∘₊✧──────✧₊∘\n\n` +

        `🎒 𝕀𝕟𝕧𝕖𝕟𝕥𝕒𝕣𝕚𝕠 🎒\n` +
        `🪼 _Pokemons_: ${currentPlayer.totalPokemonsOwned()}\n` +
        `🔮 _Pokebolas_: ${currentPlayer.getPokebola()}\n` +
        `🧪 _Poções_: ${currentPlayer.getPocao()}\n` +
        `🧬 _Revives_: ${currentPlayer.getReviver()}\n` +
        `⚱️ _Curas totais_: ${currentPlayer.getCuraTotal()}\n` +
        `🍬 _Doces raros_: ${currentPlayer.getDoceRaro()}\n\n` +

        `⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘\n`
} 
export function checkInsignia(tipoDominante) {
    const insigniasUrl = {
        "normal": { 
            typeName: tipoDominante, 
            urlBadge: "NORMAL_BADGE"
        },
        "fire": { 
            typeName: tipoDominante, 
            urlBadge: "FIRE_BADGE"
        },
        "water": { 
            typeName: tipoDominante, 
            urlBadge: "WATER_BADGE" 
        },
        "grass": { 
            typeName: tipoDominante, 
            urlBadge: "GRASS_BADGE"
        },
        "flying": { 
            typeName: tipoDominante, 
            urlBadge: "FLYING_BADGE"
        },
        "fighting": { 
            typeName: tipoDominante, 
            urlBadge: "FIGHTING_BADGE"
        },
        "poison": { 
            typeName: tipoDominante, 
            urlBadge: "POISON_BADGE"
        },
        "electric": { 
            typeName: tipoDominante, 
            urlBadge: "ELECTRIC_BADGE"
        },
        "ground": { 
            typeName: tipoDominante, 
            urlBadge: "GROUND_BADGE"
        },
        "rock": { 
            typeName: tipoDominante, 
            urlBadge: "ROCK_BADGE"
        },
        "psychic": { 
            typeName: tipoDominante, 
            urlBadge: "PSYCHIC_BADGE" 
        },
        "ice": { 
            typeName: tipoDominante, 
            urlBadge: "ICE_BADGE" 
        },
        "bug": { 
            typeName: tipoDominante, 
            urlBadge: "BUG_BADGE" 
        },
        "ghost": { 
            typeName: tipoDominante, 
            urlBadge: "GHOST_BADGE" 
        },
        "steel": { 
            typeName: tipoDominante, 
            urlBadge: "STEEL_BADGE"
        },
        "dragon": { 
            typeName: tipoDominante, 
            urlBadge: "DRAGON_BADGE"
        },
        "dark": { 
            typeName: tipoDominante, 
            urlBadge: "DARK_BADGE"
        },
        "fairy": { 
            typeName: tipoDominante, 
            urlBadge: "FAIRY_BADGE"
        }
    }

    switch (tipoDominante) {
        case "normal": 
            return insigniasUrl.normal

        case "fire":
            return insigniasUrl.fire

        case "water":
            return insigniasUrl.water

        case "grass":
            return insigniasUrl.grass

        case "flying":
            return insigniasUrl.flying

        case "fighting":
            return insigniasUrl.fighting

        case "poison":
            return insigniasUrl.poison

        case "electric":
            return insigniasUrl.electric

        case "ground":
            return insigniasUrl.ground

        case "rock":
            return insigniasUrl.rock

        case "psychic":
            return insigniasUrl.psychic

        case "ice":
            return insigniasUrl.ice

        case "bug":
            return insigniasUrl.bug

        case "ghost":
            return insigniasUrl.ghost

        case "steel":
            return insigniasUrl.steel

        case "dragon":
            return insigniasUrl.dragon

        case "dark":
            return insigniasUrl.dark

        case "fairy":
            return insigniasUrl.fairy

        default:
            return null;
    }
}
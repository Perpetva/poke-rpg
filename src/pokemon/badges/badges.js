import * as badgesUrl from './js'

export function checkInsignia(tipoDominante) {
    const insigniasUrl = {
        "normal": { 
            typeName: tipoDominante, 
            urlBadge: "NORMAL_BADGE"
        },
        "fire": { 
            typeName: tipoDominante, 
            urlBadge: "FIRE_BADGE_URL"
        },
        "water": { 
            typeName: tipoDominante, 
            urlBadge: "WATER_BADGE_URL" 
        },
        "grass": { 
            typeName: tipoDominante, 
            urlBadge: "GRASS_BADGE_URL"
        },
        "flying": { 
            typeName: tipoDominante, 
            urlBadge: "FLYING_BADGE_URL"
        },
        "fighting": { 
            typeName: tipoDominante, 
            urlBadge: "FIGHTING_BADGE_URL"
        },
        "poison": { 
            typeName: tipoDominante, 
            urlBadge: "POISON_BADGE_URL"
        },
        "electric": { 
            typeName: tipoDominante, 
            urlBadge: "ELECTRIC_BADGE_URL"
        },
        "ground": { 
            typeName: tipoDominante, 
            urlBadge: "GROUND_BADGE_URL"
        },
        "rock": { 
            typeName: tipoDominante, 
            urlBadge: "ROCK_BADGE"
        },
        "psychic": { 
            typeName: tipoDominante, 
            urlBadge: "PSYCHIC_BADGE_URL" 
        },
        "ice": { 
            typeName: tipoDominante, 
            urlBadge: "ICE_BADGE_URL" 
        },
        "bug": { 
            typeName: tipoDominante, 
            urlBadge: "BUG_BADGE_URL" 
        },
        "ghost": { 
            typeName: tipoDominante, 
            urlBadge: "GHOST_BADGE_URL" 
        },
        "steel": { 
            typeName: tipoDominante, 
            urlBadge: "STEEL_BADGE_URL"
        },
        "dragon": { 
            typeName: tipoDominante, 
            urlBadge: "DRAGON_BADGE_URL"
        },
        "dark": { 
            typeName: tipoDominante, 
            urlBadge: "DARK_BADGE_URL"
        },
        "fairy": { 
            typeName: tipoDominante, 
            urlBadge: "FAIRY_BADGE_URL"
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
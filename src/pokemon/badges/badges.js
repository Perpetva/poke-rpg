import * as badgesUrl from './badgesUrl.js'

export function checkInsignia(tipoDominante) {
    const insigniasUrl = {
        "normal": { 
            typeName: tipoDominante, 
            urlBadge: badgesUrl.NORMAL_BADGE_URL
        },
        "fire": { 
            typeName: tipoDominante, 
            urlBadge: badgesUrl.FIRE_BADGE_URL
        },
        "water": { 
            typeName: tipoDominante, 
            urlBadge: badgesUrl.WATER_BADGE_URL 
        },
        "grass": { 
            typeName: tipoDominante, 
            urlBadge: badgesUrl.GRASS_BADGE_URL 
        },
        "flying": { 
            typeName: tipoDominante, 
            urlBadge: badgesUrl.FLYING_BADGE_URL
        },
        "fighting": { 
            typeName: tipoDominante, 
            urlBadge: badgesUrl.FIGHTING_BADGE_URL
        },
        "poison": { 
            typeName: tipoDominante, 
            urlBadge: badgesUrl.POISON_BADGE_URL
        },
        "electric": { 
            typeName: tipoDominante, 
            urlBadge: badgesUrl.ELECTRIC_BADGE_URL
        },
        "ground": { 
            typeName: tipoDominante, 
            urlBadge: badgesUrl.GROUND_BADGE_URL 
        },
        "rock": { 
            typeName: tipoDominante, 
            urlBadge: badgesUrl.ROCK_BADGE_URL
        },
        "psychic": { 
            typeName: tipoDominante, 
            urlBadge: badgesUrl.PSYCHIC_BADGE_URL 
        },
        "ice": { 
            typeName: tipoDominante, 
            urlBadge: badgesUrl.ICE_BADGE_URL 
        },
        "bug": { 
            typeName: tipoDominante, 
            urlBadge: badgesUrl.BUG_BADGE_URL 
        },
        "ghost": { 
            typeName: tipoDominante, 
            urlBadge: badgesUrl.GHOST_BADGE_URL 
        },
        "steel": { 
            typeName: tipoDominante, 
            urlBadge: badgesUrl.STEEL_BADGE_URL
        },
        "dragon": { 
            typeName: tipoDominante, 
            urlBadge: badgesUrl.DRAGON_BADGE_URL
        },
        "dark": { 
            typeName: tipoDominante, 
            urlBadge: badgesUrl.DARK_BADGE_URL
        },
        "fairy": { 
            typeName: tipoDominante, 
            urlBadge: badgesUrl.FAIRY_BADGE_URL
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
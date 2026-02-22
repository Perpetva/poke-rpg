export const GET_PLAYER_BY_ID = `
SELECT
	j.id,
	j.name,
	j.phone,
	j."profileImage",
	j."pokeCoins",
	j."diaryLogin",
	i."pokeBalls",
	i."potions",
	i."revives",
	i."totalCures",
	i."rareCandies"
FROM "Jogador" j
LEFT JOIN "Item" i ON i."jogadorId" = j.id
WHERE j.id = $1
`

export const CREATE_PLAYER = `
INSERT INTO "Jogador" (id, name, phone)
VALUES ($1, $2, $3)
RETURNING id, name, phone, "profileImage", "pokeCoins", "diaryLogin"
`

export const CREATE_PLAYER_ITEMS = `
INSERT INTO "Item" ("jogadorId")
VALUES ($1)
RETURNING "pokeBalls", "potions", "revives", "totalCures", "rareCandies"
`

export const UPDATE_PLAYER_PROFILE_IMAGE = `
UPDATE "Jogador"
SET "profileImage" = $1
WHERE id = $2
`

export const GET_PLAYER_ITEM_BY_ID = `
SELECT
	i."pokeBalls",
	i."potions",
	i."revives",
	i."totalCures",
	i."rareCandies"
FROM "Item" i
WHERE i."jogadorId" = $1
`

export function UPDATE_PLAYER_ITEM_BY_ID(columnName) {
	return `
UPDATE "Item"
SET "${columnName}" = $1
WHERE "jogadorId" = $2
RETURNING "pokeBalls", "potions", "revives", "totalCures", "rareCandies"
`
}

export const CREATE_IV = `
INSERT INTO "Iv" ("hp", "speed", "attack", "defense", "specialAttack", "specialDefense")
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id
`

export const CREATE_BASE_STATS = `
INSERT INTO "BaseStats" ("hp", "speed", "attack", "defense", "specialAttack", "specialDefense")
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id
`

export const CREATE_POKEMON = `
INSERT INTO "Pokemon" (
	"specieId",
	"name",
	"level",
	"exp",
	"currentHp",
	"types",
	"evolutionStage",
	"nextEvolutionLevel",
	"jogadorId",
	"ivId",
	"baseStatsId"
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
RETURNING id
`

export const CREATE_MOVE = `
INSERT INTO "Move" ("name", "type", "maxPp", "currentPp", "power", "accuracy", "moveCategory", "pokemonId")
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
`

export const GET_PLAYER_POKEMON_BY_NAME = `
SELECT id, name
FROM "Pokemon"
WHERE "jogadorId" = $1
  AND LOWER(name) = LOWER($2)
LIMIT 1
`

export const GET_PLAYER_POKEDEX = `
SELECT id, "specieId", name, level, exp, "currentHp", types, "evolutionStage", "nextEvolutionLevel", "caughtDate"
FROM "Pokemon"
WHERE "jogadorId" = $1
ORDER BY "caughtDate" DESC
`
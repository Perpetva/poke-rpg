export const GET_PLAYER_BY_ID = `
SELECT
	j.id,
	j.name,
	j.phone,
	j."picUrl",
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
RETURNING id, name, phone, "picUrl", "pokeCoins", "diaryLogin"
`

export const CREATE_PLAYER_ITEMS = `
INSERT INTO "Item" ("jogadorId")
VALUES ($1)
RETURNING "pokeBalls", "potions", "revives", "totalCures", "rareCandies"
`

export const UPDATE_PLAYER_PIC_URL = `
UPDATE "Jogador"
SET "picUrl" = $1
WHERE id = $2
`
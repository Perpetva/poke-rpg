function findEvolutionInfo(chainNode, pokemonName, stage = 1) {
	if (chainNode.species.name === pokemonName) {
		const nextEvolution = chainNode.evolves_to?.[0]
		const nextEvolutionLevel = nextEvolution?.evolution_details?.[0]?.min_level ?? null

		return {
			evolutionStage: stage,
			nextEvolutionLevel
		}
	}

	for (const nextNode of chainNode.evolves_to ?? []) {
		const found = findEvolutionInfo(nextNode, pokemonName, stage + 1)
		if (found) return found
	}

	return null
}

function getLevelFromExperience(exp) {
	const safeExp = Math.max(0, Number(exp ?? 0))
	let level = 1

	for (let currentLevel = 1; currentLevel <= 100; currentLevel++) {
		const xpRequired = Math.floor((Math.pow(currentLevel, 3) / Math.pow(100, 3)) * 1000000)

		if (safeExp >= xpRequired) {
			level = currentLevel
		} else {
			break
		}
	}

	return level
}

function calculateHp(baseHp, ivHp, level) {
	return Math.floor((((2 * Number(baseHp ?? 0)) + Number(ivHp ?? 0)) * level) / 100) + level + 10
}

export async function mapAverageStats(chosenPokemonData, baseStats, iv) {
	const speciesData = await fetch(chosenPokemonData.species.url).then((res) => res.json())
	const evolutionChain = await fetch(speciesData.evolution_chain.url).then((res) => res.json())
	const level = getLevelFromExperience(chosenPokemonData.exp)
	const maxHp = calculateHp(baseStats.hp, iv?.hp, level)

	const evolutionInfo = findEvolutionInfo(
		evolutionChain.chain,
		chosenPokemonData.name.toLowerCase(),
		1
	)

	return {
		currentHp: maxHp,
		maxHp,
		evolutionStage: evolutionInfo?.evolutionStage ?? 1,
		nextEvolutionLevel: evolutionInfo?.nextEvolutionLevel ?? null
	}
}

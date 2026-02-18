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

export async function mapAverageStats(chosenPokemonData, baseStats) {
	const speciesData = await fetch(chosenPokemonData.species.url).then((res) => res.json())
	const evolutionChain = await fetch(speciesData.evolution_chain.url).then((res) => res.json())

	const evolutionInfo = findEvolutionInfo(
		evolutionChain.chain,
		chosenPokemonData.name.toLowerCase(),
		1
	)

	return {
		currentHp: baseStats.hp,
		evolutionStage: evolutionInfo?.evolutionStage ?? 1,
		nextEvolutionLevel: evolutionInfo?.nextEvolutionLevel ?? null
	}
}

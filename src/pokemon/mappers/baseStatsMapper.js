import BaseStats from "../../models/BaseStats.js"

export function mapBaseStats(chosenPokemonData) {
	const statsByName = {}

	chosenPokemonData.stats.forEach((stat) => {
		statsByName[stat.stat.name] = stat.base_stat
	})

	return new BaseStats(
		statsByName.hp ?? 0,
		statsByName.attack ?? 0,
		statsByName.defense ?? 0,
		statsByName["special-attack"] ?? 0,
		statsByName["special-defense"] ?? 0,
		statsByName.speed ?? 0
	)
}

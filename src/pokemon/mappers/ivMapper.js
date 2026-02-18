import Iv from "../../models/Iv.js"
import { randomNumber } from "../../utils/commonFunctions.js"

export function mapIv() {
	return new Iv(
		randomNumber(1, 31),
		randomNumber(1, 31),
		randomNumber(1, 31),
		randomNumber(1, 31),
		randomNumber(1, 31),
		randomNumber(1, 31)
	)
}

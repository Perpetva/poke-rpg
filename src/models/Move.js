class Move {
    constructor(name, type, maxPp, power, accuracy, moveCategory) {
        this.name = name
        this.type = type
        this.maxPp = maxPp
        this.power = power
        this.accuracy = accuracy
        this.moveCategory = moveCategory
        this.currentPp = maxPp
    }

    getName() {
        return this.name
    }

    getType() {
        return this.type
    }

    getMaxPp() {
        return this.maxPp
    }

    getCurrentPp() {
        return this.currentPp
    }

    getPower() {
        return this.power
    }

    getAccuracy() {
        return this.accuracy
    }

    getMoveCategory() {
        return this.moveCategory
    }
}

export default Move

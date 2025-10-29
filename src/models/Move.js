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
}

export default Move

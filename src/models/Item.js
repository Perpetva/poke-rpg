class Item {
    constructor() {
        this.pokeBalls = 5
        this.potions = 0
        this.revives = 0
        this.totalCures = 0
        this.rareCandies = 0
    }

    getItemCount(item) {
        return this[item]
    }

    addItem(item, amount = 1) {
        this[item] += amount
    }

    useItem(item, amount = 1) {
        if (this[item] >= amount) {
            this[item] -= amount
            return true
        }
        return false
    }
}

export default Item

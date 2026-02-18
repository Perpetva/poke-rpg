class Item {
    constructor() {
        this.pokeBalls = 5
        this.potions = 0
        this.revives = 0
        this.totalCures = 0
        this.rareCandies = 0
    }

    getItemCount(itemName) {
        return this[itemName] ?? 0
    }

    static fromDbRow(row = {}) {
        const item = new Item()

        if (row.pokeBalls !== undefined && row.pokeBalls !== null) item.pokeBalls = row.pokeBalls
        if (row.potions !== undefined && row.potions !== null) item.potions = row.potions
        if (row.revives !== undefined && row.revives !== null) item.revives = row.revives
        if (row.totalCures !== undefined && row.totalCures !== null) item.totalCures = row.totalCures
        if (row.rareCandies !== undefined && row.rareCandies !== null) item.rareCandies = row.rareCandies

        return item
    }

}

export default Item

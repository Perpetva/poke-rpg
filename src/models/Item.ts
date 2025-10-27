
class Item {
    private pokeBalls: number;
    private potions: number;
    private revives: number;
    private totalCures: number;
    private rareCandies: number;

    constructor() {
        this.pokeBalls = 5;
        this.potions = 0;
        this.revives = 0;
        this.totalCures = 0;
        this.rareCandies = 0;
    }

    getItemCount(item: 'pokeBalls' | 'potions' | 'revives' | 'totalCures' | 'rareCandies'): number {
        return this[item];
    }

    addItem(item: 'pokeBalls' | 'potions' | 'revives' | 'totalCures' | 'rareCandies', amount: number = 1) {
        this[item] += amount;
    }

    useItem(item: 'pokeBalls' | 'potions' | 'revives' | 'totalCures' | 'rareCandies', amount: number = 1): boolean {
        if (this[item] >= amount) {
            this[item] -= amount;
            return true;
        }
        return false;
    }
}

export default Item;

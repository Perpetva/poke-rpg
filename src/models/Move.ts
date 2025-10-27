class Move {
    private currentPp: number;
    private name: string;
    private type: string;
    private maxPp: number;
    private power: number;
    private accuracy: number;
    private moveCategory: string;

    constructor(name: string, type: string, maxPp: number, power: number, accuracy: number, moveCategory: string) {
        this.name = name;
        this.type = type;
        this.maxPp = maxPp;
        this.power = power;
        this.accuracy = accuracy;
        this.moveCategory = moveCategory;
        this.currentPp = maxPp;
    }
}

export default Move;
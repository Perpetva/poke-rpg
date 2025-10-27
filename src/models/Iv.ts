class Iv {
    private hp: number;
    private speed: number;
    private attack: number;
    private defense: number;
    private specialAttack: number;
    private specialDefense: number;

    constructor(hp: number, speed: number, attack: number, defense: number, specialAttack: number, specialDefense: number) {
        this.hp = hp;
        this.speed = speed;
        this.attack = attack;
        this.defense = defense;
        this.specialAttack = specialAttack;
        this.specialDefense = specialDefense;
    }
}

export default Iv;
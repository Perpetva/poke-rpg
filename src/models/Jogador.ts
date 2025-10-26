
class Jogador {

    private id: number;
    private name: string;
    private phone: string;

    private picUrl: string | null;
    private pokeCoins: number;
    private diaryLogin: Date | null;

    constructor(id: number, name: string, phone: string) {
        this.id = id
        this.name = name;
        this.phone = phone;

        this.picUrl = null;
        this.pokeCoins = 500;
        this.diaryLogin = null;
    }

}
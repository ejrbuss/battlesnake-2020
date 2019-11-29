import { Game } from "./Game";

export class SnakeMob {

    points: Uint16Array;
    heads: number;
    
    constructor(points: Uint16Array, heads: number) {
        this.points = points;
        this.heads = heads;
    }

    futureState(game: Game): SnakeMob {
        return this;
    }

}
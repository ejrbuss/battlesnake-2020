import { Game } from './Game';
import { Point } from './Point';

export class SnakeMob {

    points: Uint16Array;
    heads: number;
    
    private constructor(points: Uint16Array, heads: number) {
        this.points = points;
        this.heads = heads;
    }

    static fromPoints(heads: Point[], tail?: SnakeMob): SnakeMob {

    }

    move(game: Game): SnakeMob {
        return this;
    }

}
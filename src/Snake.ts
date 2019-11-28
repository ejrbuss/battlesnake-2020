import { Point } from "./Point";

class Snake {

    readonly length: number;
    readonly heads: Point[];
    readonly front: Point[];
    readonly back: Snake | null;

    constructor(length: number, heads: Point[], ) {
        this.length = length;
        this.heads = heads;
        this.tail = tail;
    }

    intersects(that: Snake): boolean {
        // Use the fact that a point only collides if manhattan distance is 0,
        // ie. manhattan distance of 10 means skip 10 - this is only good for arrays hmmm

        // Is a persistent set possible?

        // We know the tails haven't collided!!!! we only have to check the heads!!!
        return true;
    }

}
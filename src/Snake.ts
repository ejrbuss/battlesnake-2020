import { Point } from "./Point";
import { Game } from "./Game";

/**
 * A Snake is represented as an array of points where the first point in the
 * array is the head of the snake.
 * 
 * A Snake also keeps track of whether it is growing. If it is growing its
 * future states will be 1 longer than it (meaning their internal arrays will
 * have be of length + 1).
 */
export class Snake {
    
    /**
     * A Uint16Array is used to keep track of points because:
     *  - Points are always unsigned integers
     *  - A max value of 65536 corresponds to a board size of 256 * 256, which
     *    should be plenty big enough
     */
    readonly points: Uint16Array;
    grow: boolean;

    private constructor(points: Uint16Array) {
        this.points = points;
        this.grow   = false; // Left undetermined until postMove
    }

    /**
     * Returns a new Snake from an array of Points
     */
    static fromPoints(points: Point[]): Snake {
        const buffer = new Uint16Array(points.length);
        buffer.set(points);
        return new Snake(buffer);
    }

    /**
     * Returns a new Snake given a new head.
     */
    fromHead(head: Point): Snake {
        if (this.grow) {
            // If we are growing we need to allocate + 1 on our new buffer.
            const buffer = new Uint16Array(this.points.length + 1);
            buffer.set(this.points, 1);
            buffer[0] = head;
            return new Snake(buffer);
        } else {
            // If we are not growing we need to copy over all but our tail
            const buffer = new Uint16Array(this.points.length);
            buffer.set(this.points.subarray(0, buffer.length - 1), 1);
            buffer[0] = head;
            return new Snake(buffer);
        }
    }

    /**
     * The head of this snake
     */
    get head() {
        return this.points[0];
    }

    /**
     * The tail of this snake
     */
    get tail() {
        return this.points[this.points.length - 1];
    }

    get length() {
        if (this.grow) {
            return this.points.length + 1;
        } else {
            return this.points.length;
        }
    }

    /**
     * Prepare the game for the upcoming move: remove our tail from the board
     * so other snakes can move into that spot.
     */
    preMove(game: Game): void {
        // If we are growing, we don't remove our tail
        if (!this.grow) { game.unset(this.tail); }
    }

    /**
     * Return all possible future states of this Snake.
     */
    getFutureSnakes(game: Game): Snake[] {
        // These are all possible heads that fit in the board, we still need 
        // to check if those spots are free
        const futureHeads = game.points.neighbors(this.head);
        const futureStates = [];
        for (const head of futureHeads) {
            if (game.freeAt(head)) {
                // The board is free for our new head, we're safe to move there
                futureStates.push(this.fromHead(head));
            } else {
                // TODO handle collisions
                // We may want to handle the case that we hit the head of a 
                // snake that is shorter than us, but for now we'll just be 
                // ultra conservative and do nothing in this case
            }
        }
        return futureStates;
    }

    /**
     * Apply our move to the game, we know at this point that where we are 
     * movign is free and that our old tail has already been taken off the board
     * if we weren't growing.
     */
    move(game: Game): void {
        game.set(this.head);
        // If we ended up eating food, then we get to grow!
        if (game.foodAt(this.head)) {
            game.eat(this.head);
            this.grow = true;
        }
    }

}
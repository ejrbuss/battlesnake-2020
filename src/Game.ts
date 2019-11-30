import { Snake } from './Snake';
import { RequestWrapper } from './Request';
import { PointProvider, Point } from './Point';
import { Bitfield } from './Bitfield';
import { SnakeMob } from './SnakeMob';

export class Game {

    readonly points: PointProvider;
    private snake: Snake;
    private mob: SnakeMob;
    private board: Bitfield;
    private food: Bitfield;

    constructor(
        points: PointProvider, 
        snake: Snake,
        mob: SnakeMob,
        board: Bitfield, 
        food: Bitfield
    ) {
        this.points = points;
        this.snake  = snake;
        this.mob    = mob;
        this.board  = board;
        this.food   = food;
    }

    static fromRequest(request: RequestWrapper): Game {
        return new Game(
            request.points,
            request.snake,
            request.mob,
            request.board,
            request.food,
        );
    }

    /**
     * A comparison function to sort Games based on score
     */
    static byScore(g1: Game, g2: Game): number {
        return g1.score() - g2.score();
    }

    /**
     * Returns a shallow copy of the Game (except for the board which is deeply
     * copied). 
     * 
     * All elements besides the board should be treated as immutable, and 
     * updates should be done by reassignment.
     */
    copy(): Game {
        return new Game(
            this.points,
            this.snake,
            this.mob,
            this.board.copy(),
            this.food,
        );
    }

    /**
     * Returns true if the board is empty at `point`
     */
    freeAt(point: Point): boolean {
        return !this.board.get(point);
    }

    /**
     * Sets the board at `point`
     */
    set(point: Point): void {
        this.board.set(point);
    }

    /**
     * Unsets the baord at `point`
     */
    unset(point: Point): void {
        this.board.unset(point);
    }

    /**
     * Returns true if there is foot at `point`
     */
    foodAt(point: Point): boolean {
        return this.food.get(point);
    }

    /**
     * Eats the food at `point` (food is removed from the food Bitfield)
     */
    eat(point: Point): void {
        // We are using copy on write semantics
        // So long as food doesn't change Game instances can share the same
        // food instance, as soon as we need to write to it, we make a copy and
        // then write.
        this.food = this.food.copy();
        this.food.unset(point);
    }

    /**
     * Returns all possible next game states for this game state
     */
    getFutureGames(): Game[] {
        const intermediateGame = this.copy(); // debatable if this is needed (test me)
        this.snake.preMove(intermediateGame);
        intermediateGame.mob = this.mob.move(this);
        return this.snake.getFutureSnakes(intermediateGame).map(futureSnake => {
            const futureGame = intermediateGame.copy();    
            futureGame.snake = futureSnake;        
            futureSnake.move(futureGame);
            return futureGame;
        });
    }

    /**
     * Returns the score for this game state
     * 
     * Depth first search of future game states trying to find the max depth or
     * a path to `maxDepth`.
     */
    score(): number {
        const maxDepth = 3;
        let bestDepth = 0;
        // LIFO queue is loaded up with future game states to explore and their
        // depth (number of futures ahead) of this game state, we start with
        // this game state as the only one to explore and a depth of 0
        let queue: [ Game, number ][] = [ [ this, 0 ] ];
        // As long as their are potential futures search for a better depth
        while (queue.length > 0) {
            const [ game, depth ] = queue.pop() as [ Game, number ];
            // We check depth when we pop
            if (depth > bestDepth) {
                bestDepth = depth;
                // If we hit maxDepth we immediately return
                if (depth >= maxDepth) {
                    return maxDepth;
                }
            }
            // Push all our futures onto the queue
            for (const state of game.getFutureGames()) {
                queue.push([ state, depth + 1 ]);
            }
        }
        return bestDepth;
    }

    /**
     * The Game's "head" is just our snake's head
     */
    get head() {
        return this.snake.head;
    }

}
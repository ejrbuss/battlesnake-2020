import { Snake } from './Snake';
import { PointProvider, Point } from './Point';
import { SnakeMob } from './SnakeMob';
import { Bitfield } from './Bitfield';

/**
 * Interface based on battlesnake API
 * https://docs.battlesnake.com/snake-api
 */

export interface RequestPoint {
    x: number;
    y: number;
}

export interface RequestSnake {
    id: string;
    health: number;
    body: RequestPoint[];
}

export interface RequestBoard {
    width: number;
    height: number;
    food: RequestPoint[];
    snakes: RequestSnake[];
}

export interface Request {
    board: RequestBoard;
    you: RequestSnake;
}

/**
 * Wraps the incoming requests and handles conversions from the request 
 * representation of points, snakes, food, etc. to the internal representation.
 */
export class RequestWrapper {

    readonly points: PointProvider;
    readonly snake: Snake;
    readonly mob: SnakeMob
    readonly board: Bitfield;
    readonly food: Bitfield;

    constructor(request: Request) {
        this.points = this.pointsFromRequest(request);
        this.snake  = this.snakeFromRequest(request);
        this.mob    = this.mobFromRequest(request);
        this.board  = this.boardFromRequest(request);
        this.food   = this.foodFromRequest(request);
    }

    /**
     * Retrieve the `PointProvider` from the reqeuest
     */
    private pointsFromRequest(request: Request): PointProvider {
        return new PointProvider(
            request.board.width, 
            request.board.height,
        );
    }

    /**
     * Retrieve you, the current `Snake`, from the request
     */
    private snakeFromRequest(request: Request): Snake {
        return Snake.fromPoints(this.requestPointsToPoints(request.you.body));
    }

    /**
     * Retrieve the `SnakeMob` from a request. The `SnakeMob` represents all other
     * snakes.
     */
    private mobFromRequest(request: Request): SnakeMob {
        const snakeId     = request.you.id;
        const otherSnakes = request.board.snakes
            .filter(snake => snake.id !== snakeId)
            .map(snake => this.requestPointsToPoints(snake.body));
        const maxLength = Math.max(...otherSnakes.map(snake => snake.length));
        let mob;
        for (let i = 0; i < maxLength; i++) {
            let heads = [];
            for (const snake of otherSnakes) {
                const p = snake[i];
                if (p !== undefined) {
                    heads.push(p);
                }
            }
            mob = SnakeMob.fromPoints(heads, mob); 
        }
        return mob as SnakeMob;
    }

    /**
     * Retrieve the board as a `Bitfield` from a request
     */
    private boardFromRequest(_: Request): Bitfield {
        const board = Bitfield.withSize(this.points.bounds);
        // Set the board at all of snake's positions
        for (const point of this.snake.points) {
            board.set(point);
        }
        // Set the board at all of the mob's positions
        for (const point of this.mob.points) {
            board.set(point);
        }
        return board;
    }

    /**
     * Retrieve food locations as a `Bitfield` from a request
     */
    private foodFromRequest(request: Request): Bitfield {
        const food = Bitfield.withSize(this.points.bounds);
        for (const p of this.requestPointsToPoints(request.board.food)) {
            food.set(p);
        }
        return food;
    }
  
    /**
     * Convert an array of `RequestPoint`s to an array of `Point`s
     */
    private requestPointsToPoints(points: RequestPoint[]): Point[] {
        return points.map(p => this.requestPointToPoint(p));
    }

    /**
     * Convert a `RequestPoint` to a `Point`
     */
    private requestPointToPoint({ x, y }: RequestPoint): Point {
        return this.points.mustGet(x, y);
    }

}
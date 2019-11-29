import { Snake } from "./Snake";
import { Request } from "./Request";
import { PointProvider, Point } from "./Point";
import { Bitfield } from "./Bitfield";
import { SnakeMob } from "./SnakeMob";

export class Game {

    readonly points: PointProvider;
    private you: Snake;
    private others: SnakeMob;
    private board: Bitfield;
    private food: Bitfield;

    constructor(
        points: PointProvider, 
        you: Snake, 
        others: SnakeMob, 
        board: Bitfield, 
        food: Bitfield
    ) {
        this.points = points;
        this.you    = you;
        this.others = others;
        this.board  = board;
        this.food   = food;
    }

    static fromRequest(request: Request): Game {

    }

    static byScore(g1: Game, g2: Game): number {
        return g1.score() - g2.score();
    }

    copy(): Game {
        return new Game(
            this.points,
            this.you,
            this.others,
            this.board.copy(),
            this.food,
        );
    }

    freeAt(point: Point): boolean {
        return !this.board.get(point);
    }

    set(point: Point): void {
        this.board.set(point);
    }

    unset(point: Point): void {
        this.board.unset(point);
    }

    foodAt(point: Point): boolean {
        return this.food.get(point);
    }

    eat(point: Point): void {
        // Copy on write
        this.food = this.food.copy();
        this.food.unset(point);
    }

    futureStates(): Game[] {
        const intermediate = this.copy(); // debatable if this is needed
        this.you.preMove(intermediate);
        const futureOthers = this.others.futureState(intermediate);
        return this.you.futureStates(intermediate).map(futureYou => {
            const futureState = intermediate.copy();
            futureYou.postMove(futureState);
            futureState.others = futureOthers;
            futureState.you = futureYou;
            return futureState;
        });

    }

    score(): number {
        const maxDepth = 3;
        let best = 0;
        let queue: [Game, number][] = [[this, 0]];
        while (queue.length > 0) {
            const workItem = queue.pop();
            if (workItem) {
                const [ game, depth ] = workItem;
                if (depth > best) {
                    best = depth;
                    if (depth >= maxDepth) {
                        return maxDepth;
                    }
                }
                for (const state of game.futureStates()) {
                    queue.push([ state, depth + 1 ]);
                }
            }
        }
        return best;
    }

    get head {
        return this.you.head
    }

}
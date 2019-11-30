import { Request, RequestWrapper } from './Request';
import { Game } from './Game';

const defaultMove = 'up';

/**
 * Accepts a request, and returns an appropriate move (hopefully).
 */
export function move(request: RequestWrapper): string {
    const game           = Game.fromRequest(request);
    const [ bestFuture ] = game.getFutureGames().sort(Game.byScore);
    const bestMove       = game.points.move(game.head, bestFuture.head);
    return bestMove || defaultMove;
}
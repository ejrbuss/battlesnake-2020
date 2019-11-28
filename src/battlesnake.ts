import { 
    RPoint, 
    RSnake,
    RBoard,
    RGame,
    RMove,  
} from './types';

export function move(request: RGame): RMove {
    console.log(request);
    return 'up';
}
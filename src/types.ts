export type RMove = 'up' | 'down' | 'left' | 'right';

export interface RPoint {
    x: number;
    y: number;
}

export interface RSnake {
    id: string;
    health: number;
    body: RPoint[];
}

export interface RBoard {
    width: number;
    height: number;
    food: RPoint[];
    snakes: RSnake[];
}

export interface RGame {
    board: RBoard;
    you: RSnake;
}
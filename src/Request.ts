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
import { RMove } from "./types";

export type Point = Readonly<Int32Array>;

export class PointProvider {

    readonly width: number;
    readonly height: number;
    readonly buffer: Int32Array;
    readonly cache: Point[];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.buffer = new Int32Array(width * height * 2);
        this.cache = new Array(width * height);
        let p = 0;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                this.cache[p / 2] = this.buffer.subarray(p, p + 2);
                this.buffer[p] = x;
                p++;
                this.buffer[p] = y;
                p++;
            }
        }
    }

    get(x: number, y: number): Point | null {
        const p = this.width * x + y;
        if (p < 0 || p >= this.width * this.height) {
            return null;
        }
        return this.cache[p];
    }

    up(p: Point): Point | null {
        return this.get(p[0], p[1] - 1);
    }

    down(p: Point): Point | null {
        return this.get(p[0], p[1] + 1);
    }

    left(p: Point): Point | null {
        return this.get(p[0] - 1, p[1]);
    }

    right(p: Point): Point | null {
        return this.get(p[0] + 1, p[1]);
    }

    move(p1: Point, p2: Point): RMove | null {
        if (p2 === this.up(p1))    { return 'up'; }
        if (p2 === this.down(p1))  { return 'down'; }
        if (p2 === this.left(p1))  { return 'left'; }
        if (p2 === this.right(p1)) { return 'right'; }
        return null;
    }

    manhattan(p1: Point, p2: Point): number {
        return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
    }

}
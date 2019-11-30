
/**
 * We encode 2d points as indexes in to an array of size width * height. For
 * example (0, 0) is represented as just 0. More generally the conversion to
 * an index is:
 * 
 *  index = y * width + x
 * 
 * And to convert back:
 * 
 *  x = index % width
 *  y = index / width (With integer division)
 */
export type Point = number;

/**
 * In order to correctly encode points we need to know the dimensions of our
 * array (width and height). These details are encoded in `PointProvider` which
 * handles common Point operations, so that users of Points do not have to
 * care about the integer representation.
 */
export class PointProvider {

    readonly width: number;
    readonly height: number;
    readonly bounds: number;
    
    constructor(width: number, height: number) {
        // We | 0 because we REALLY want all of these to be integers
        this.width  = width            | 0;
        this.height = height           | 0;
        this.bounds = (width * height) | 0;
    }

    /**
     * Returns the point (index) that represents (x, y) if it exists in this
     * PointProvider's domain
     */
    get(x: number, y: number): Point | undefined {
        if (x < 0 || x >= this.width)  { return; }
        if (y < 0 || y >= this.height) { return; }
        const p = y * this.width + x;
        return p;
    }

    /**
     * Like get, but must return a point, otherwise it will throw
     */
    mustGet(x: number, y: number): Point {
        const p = this.get(x, y);
        if (p !== undefined) { 
            return p; 
        } else { 
            throw new Error(`mustGet failed for (${x}, ${y}) on board of size ${this.width}*${this.height}`); 
        }
    }

    /**
     * Returns the point above `p`
     */
    up(p: Point): Point | undefined {
        return this.get(this.x(p), this.y(p) - 1);
    }

    /**
     * Returns the point below `p`
     */
    down(p: Point): Point | undefined {
        return this.get(this.x(p), this.y(p) + 1);
    }

    /**
     * Returns the point left of `p`
     */
    left(p: Point): Point | undefined {
        return this.get(this.x(p) - 1, this.y(p));
    }

    /**
     * Returns the point right of `p`
     */
    right(p: Point): Point | undefined {
        return this.get(this.x(p) + 1, this.y(p));
    }

    /**
     * Returns the direction of a move as a string from point `p1` to `p2` if 
     * applicable
     */
    move(p1: Point, p2: Point): string | undefined {
        if (p2 === this.up(p1))    { return 'up';    }
        if (p2 === this.down(p1))  { return 'down';  }
        if (p2 === this.left(p1))  { return 'left';  }
        if (p2 === this.right(p1)) { return 'right'; }
        return undefined;
    }

    /**
     * Returns all neighboring points of `p`
     */
    neighbors(p: Point): Point[] {
        const up        = this.up(p);
        const down      = this.down(p);
        const left      = this.left(p);
        const right     = this.right(p);
        const neighbors = [];
        if (undefined !== up)    { neighbors.push(up);    }
        if (undefined !== down)  { neighbors.push(down);  }
        if (undefined !== left)  { neighbors.push(left);  }
        if (undefined !== right) { neighbors.push(right); }
        return neighbors;
    }

    /**
     * Returns the manhattan distance between 2 points.
     * https://xlinux.nist.gov/dads/HTML/manhattanDistance.html
     */
    manhattan(p1: Point, p2: Point): number {
        return (
            Math.abs(this.x(p1) - this.x(p2)) + 
            Math.abs(this.y(p1) - this.y(p2))
        );
    }

    /**
     * Get the x value of point `p`
     */
    x(p: Point) {
        return p % this.width;
    }

    /**
     * Get the y value of point `p`
     */
    y(p: Point) {
        // JavaScript will only bitwise OR integers, so | 0 effectively floors
        // the result (but ever so slightly faster than Math.floor)
        // https://jsperf.com/or-vs-floor/2
        return (p / this.width) | 0;
    }

    /**
     * Print a readable version of point `p` in the form "(x, y)""
     */
    toString(p: Point) {
        return `(${this.x(p)}, ${this.y(p)})`;
    }

}
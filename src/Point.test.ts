import { PointProvider, Point } from "./Point";

const Points = new PointProvider(10, 10);

function expectPoint(x: number, y: number): Point {
    const p = Points.get(x, y);
    expect(p).toBeGreaterThanOrEqual(0);
    return p as Point;
}


test('PointProvider.get', () => {
    function testPoint(x: number, y: number) {
        const p = expectPoint(x, y);
        expect(Points.x(p)).toBe(x);
        expect(Points.y(p)).toBe(y);
        expect(p === Points.get(x, y));
    }

    testPoint(0, 0);
    testPoint(9, 9);
    testPoint(5, 5);
    testPoint(0, 5);
    testPoint(9, 5);
    testPoint(5, 0);
    testPoint(5, 9);
    testPoint(4, 3);
});

test('PointProvider.up', () => {
    expect(Points.up(expectPoint(5, 5))).toBe(Points.get(5, 4));
});

test('PointProvider.down', () => {
    expect(Points.down(expectPoint(5, 5))).toBe(Points.get(5, 6));
});

test('PointProvider.left', () => {
    expect(Points.left(expectPoint(5, 5))).toBe(Points.get(4, 5));
});

test('PointProvider.right', () => {
    expect(Points.right(expectPoint(5, 5))).toBe(Points.get(6, 5));
});

test('PointProvider.move', () => {
    const p = expectPoint(5, 5);
    const up = Points.up(p);
    const down = Points.down(p);
    const left = Points.left(p);
    const right = Points.right(p);
    expect(up && down && left && right).toBeTruthy();
    if (up && down && left && right) {
        expect(Points.move(p, up)).toBe('up');
        expect(Points.move(p, down)).toBe('down');
        expect(Points.move(p, left)).toBe('left');
        expect(Points.move(p, right)).toBe('right');
    }
});

test('PointProvider.manhattan', () => {
    const p1 = expectPoint(2, 3);
    const p2 = expectPoint(7, 7);
    expect(Points.manhattan(p1, p2)).toBe(9);
});

test('PointProvider.toString', () => {
    const p = expectPoint(4, 8);
    expect(Points.toString(p)).toBe('(4, 8)');
});
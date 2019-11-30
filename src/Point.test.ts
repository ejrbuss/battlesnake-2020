import { PointProvider, Point } from "./Point";

const points = new PointProvider(10, 10);

test('PointProvider.get', () => {
    function testPoint(x: number, y: number) {
        const p = points.get(x, y) as Point;
        expect(points.x(p)).toBe(x);
        expect(points.y(p)).toBe(y);
        expect(p === points.get(x, y));
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

test('PointProvider.mustGet', () => {
    expect(points.mustGet(0, 0)).toBeDefined();
    expect(() => { points.mustGet(-1, -1); }).toThrow();
});

test('PointProvider.up', () => {
    expect(points.up(points.mustGet(5, 5))).toBe(points.get(5, 4));
});

test('PointProvider.down', () => {
    expect(points.down(points.mustGet(5, 5))).toBe(points.get(5, 6));
});

test('PointProvider.left', () => {
    expect(points.left(points.mustGet(5, 5))).toBe(points.get(4, 5));
});

test('PointProvider.right', () => {
    expect(points.right(points.mustGet(5, 5))).toBe(points.get(6, 5));
});

test('PointProvider.move', () => {
    const p = points.mustGet(5, 5);
    const up = points.up(p);
    const down = points.down(p);
    const left = points.left(p);
    const right = points.right(p);
    expect(up && down && left && right).toBeTruthy();
    if (up && down && left && right) {
        expect(points.move(p, up)).toBe('up');
        expect(points.move(p, down)).toBe('down');
        expect(points.move(p, left)).toBe('left');
        expect(points.move(p, right)).toBe('right');
    }
});

test('PointProvider.manhattan', () => {
    const p1 = points.mustGet(2, 3);
    const p2 = points.mustGet(7, 7);
    expect(points.manhattan(p1, p2)).toBe(9);
});

test('PointProvider.toString', () => {
    const p = points.mustGet(4, 8);
    expect(points.toString(p)).toBe('(4, 8)');
});
import { Snake } from "./Snake";
import { PointProvider } from "./Point";

const points = new PointProvider(10, 10);

function getSimpleSnake(): Snake {
    return Snake.fromPoints([
        points.mustGet(2, 0), 
        points.mustGet(1, 0), 
        points.mustGet(0, 0),
    ]);
}

test('Snake.fromPoints', () => {
    getSimpleSnake();
});

test('Snake.head', () => {
    const s = getSimpleSnake();
    expect(s.head).toBe(points.mustGet(2, 0));
});

test('Snake.tail', () => {
    const s = getSimpleSnake();
    expect(s.tail).toBe(points.mustGet(0, 0));
});

test('Snake.length', () => {
    const s = getSimpleSnake();
    expect(s.length).toBe(3);
    s.grow = true;
    expect(s.length).toBe(4);
});

test('Snake.fromHead', () => {
    const s1 = getSimpleSnake();
    const head = points.mustGet(3, 0);
    const s2 = s1.fromHead(head);
    expect(s2.head).toBe(head);
    expect(s2.tail).toBe(points.mustGet(1, 0));
    s1.grow = true;
    const s3 = s1.fromHead(head);
    expect(s3.head).toBe(head);
    expect(s3.tail).toBe(points.mustGet(0, 0));
});

test('Snake.preMove', () => {
    const mock = jest.fn();
    const g    = { unset: mock } as any;
    const s    = getSimpleSnake();
    s.preMove(g);
    expect(mock.mock.calls.length).toBe(1);
    expect(mock.mock.calls[0][0]).toBe(s.tail);
    s.grow = true;
    s.preMove(g);
    expect(mock.mock.calls.length).toBe(1);
});

test('Snake.getFutureSnakes', () => {
    const mockTrue  = jest.fn(_ => true);
    const mockFalse = jest.fn(_ => false);
    const s1 = getSimpleSnake();
    let g;
    g = { freeAt: mockTrue, points } as any;
    const ss1 = s1.getFutureSnakes(g);
    expect(mockTrue.mock.calls.length).toBe(3);
    expect(ss1.length).toBe(3);
    g = { freeAt: mockFalse, points } as any;
    const ss2 = s1.getFutureSnakes(g);
    expect(mockFalse.mock.calls.length).toBe(3);
    expect(ss2.length).toBe(0);
});

test('Snake.move', () => {
    const mock      = jest.fn();
    const mockTrue  = jest.fn(_ => true);
    const mockFalse = jest.fn(_ => false);
    const s         = getSimpleSnake();
    let g;
    g = { set: mock, foodAt: mockTrue, eat: mock } as any;
    s.move(g);
    expect(mockTrue.mock.calls.length).toBe(1);
    expect(mockTrue.mock.calls[0][0]).toBe(s.head);
    expect(mock.mock.calls.length).toBe(2);
    expect(mock.mock.calls[0][0]).toBe(s.head);
    expect(mock.mock.calls[1][0]).toBe(s.head);
    g = { set: mock, foodAt: mockFalse, eat: mock } as any;
    s.move(g);
    expect(mockFalse.mock.calls.length).toBe(1);
    expect(mockFalse.mock.calls[0][0]).toBe(s.head);
    expect(mock.mock.calls.length).toBe(3);
    expect(mock.mock.calls[2][0]).toBe(s.head);
});
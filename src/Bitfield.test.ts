import { Bitfield } from './Bitfield';

test('Bitfield.withSize', () => {
    const f = Bitfield.withSize(128);
    for (let i = 0; i < 128; i++) {
        f.set(i);
        for (let j = 0; j < 128; j++) {
            expect(f.get(j)).toBe(i === j);
        }
        f.unset(i);
    }
});

test('Bitfield.copy', () => {
    const f1 = Bitfield.withSize(10);
    f1.set(7);
    const f2 = f1.copy();
    expect(f2.get(7)).toBe(true);
    f2.set(3);
    expect(f1.get(3)).toBe(false);
    expect(f2.get(3)).toBe(true);
});

test('Bitfield.set', () => {
    const f = Bitfield.withSize(10);
    expect(f.get(2)).toBe(false);
    f.set(2);
    expect(f.get(2)).toBe(true);
});

test('Bitfield.unset', () => {
    const f = Bitfield.withSize(10);
    f.set(5);
    expect(f.get(5)).toBe(true);
    f.unset(5);
    expect(f.get(5)).toBe(false);
});

test('Bitfield.setTo', () => {
    const f = Bitfield.withSize(10);
    f.setTo(9, true);
    expect(f.get(9)).toBe(true);
    f.setTo(9, false);
    expect(f.get(9)).toBe(false);
});
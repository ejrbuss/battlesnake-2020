/**
 * Simplified Bitfield implementation based on:
 *  https://github.com/fb55/bitfield
 * 
 * A bitfield provides an easy mapping of integer => boolean values. A buffer
 * is created (the field) and each bit in that field represents the boolean
 * value of that bits index. 
 * 
 * Bitfields have several advantages over other ways of keeping track of 
 * boolean properties:
 *  - Small: 1 byte per 8 boolean properties
 *  - Fast: Loopkup and setting is an indexing operation and some integer 
 *    arithmetic
 */
export class Bitfield {

    readonly buffer: Uint8Array;

    private constructor(buffer: Uint8Array) {
        this.buffer = buffer;
    }

    static withSize(size: number) {
        // Allocate size / 8 (integer division) + 1 bytes
        // this will always be enough for the desired size
        return new Bitfield(new Uint8Array((size >> 3) + 1));
    }

    copy() {
        return new Bitfield(new Uint8Array(this.buffer));
    }

    /**
     * Returns true if index `i` is set
     */
    get(i: number): boolean {
        // i >> 3 will return the index of the correct byte block
        // 0x80 shifted by i % 8 will be a mask for the correct bit
        // !! coerces to a boolean
        return !!(this.buffer[i >> 3] & (0x80 >> (i % 8)));
    }

    /**
     * Sets index `i`
     */
    set(i: number): void {
        this.buffer[i >> 3] |= 0x80 >> (i % 8);
    }

    /**
     * Unsets index `i`
     */
    unset(i: number): void {
        this.buffer[i >> 3] &= ~(0x80 >> (i % 8));
    }

    /**
     * Sets index `i` to value `b`
     */
    setTo(i: number, b: boolean): void {
        if (b) { this.set(i); } 
        else   { this.unset(i); }
    }

}
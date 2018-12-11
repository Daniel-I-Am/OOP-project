/* 
 * This file is not going to get a lot of comments.
 * It is just math, a lot of it. There's nothing difficult about it.
 * These are standard mathematical operations, just... on vectors.
 */
class Vector {
    public x: number;
    public y: number

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public toArray(): Array<number> {
        return [this.x, this.y]
    }

    public getSize(): number {
        return Math.sqrt(this.x**2 + this.y**2);
    }

    public add(vector: Vector): Vector {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    public sub(vector: Vector): Vector {
        return this.add(vector.multiply(-1));
    }

    public multiply(scalar: number): Vector {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    public normalize(): Vector {
        this.multiply(1/this.getSize());
        return this;
    }

    public max(n: number): Vector {
        if (this.getSize() > n)
            this.multiply(n/this.getSize());
        return this;
    }

    public min(n: number): Vector {
        if (this.getSize() < n)
            this.multiply(n/this.getSize());
        return this;
    }

    public rotate(radians: number): Vector {
        let myValue = this.toArray();
        let x = myValue[0],
            y = myValue[1];
        this.x = x*Math.cos(radians)-y*Math.sin(radians);
        this.y = x*Math.sin(radians)+y*Math.cos(radians);
        return this;
    }

    public toString(): string {
        return `[${this.toArray().map(e => e.toString()).join(", ")}]`
    }
}
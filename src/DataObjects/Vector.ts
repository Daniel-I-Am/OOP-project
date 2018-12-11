/* 
 * This file is not going to get a lot of comments.
 * It is just math, a lot of it. There's nothing difficult about it.
 * These are standard mathematical operations, just... on vectors.
 */
class Vector {
    private numbers: Array<number>;

    public constructor(...args: Array<number>) {
        this.numbers = args;
    }

    public toArray(): Array<number> {
        return this.numbers;
    }

    public getValue(n: number): number {
        return this.numbers[n];
    }

    public updateValue(i: number, n: number): void {
        this.numbers[i] = n;
    }

    public getSize(): number {
        return Math.sqrt(this.numbers.map(e => e**2).reduce((a,b) => a+b, 0));
    }

    public getDim(): number {
        return this.numbers.length;
    }

    public add(vector: Vector): Vector {
        if (this.getDim() != vector.getDim())
            throw new Error(`Dimension of vector does not match.\n${this.getDim()} != ${vector.getDim()}`);
        let myValue = this.toArray(),
            thatValue = vector.toArray();
        return new Vector(...myValue.map((e,i) => e+thatValue[i]));
    }

    public sub(vector: Vector): Vector {
        return this.add(vector.multiply(-1));
    }

    public multiply(scalar: number): Vector {
        return new Vector(...this.toArray().map(e => e*scalar));
    }

    public normalize(): Vector {
        return this.multiply(1/this.getSize());
    }

    public max(n: number): Vector {
        if (this.getSize() <= n)
            return this;
        return this.multiply(n/this.getSize());
    }

    public min(n: number): Vector {
        if (this.getSize() >= n)
            return this;
        return this.multiply(n/this.getSize());
    }

    public rotate(radians: number) {
        if (this.getDim() != 2)
            throw new Error(`Rotate can only be called on a 2-dim vector\n${this.getDim()} != 2`);
        let myValue = this.toArray();
        let x = myValue[0],
            y = myValue[1];
        return new Vector(x*Math.cos(radians)-y*Math.sin(radians), x*Math.sin(radians)+y*Math.cos(radians));
    }

    public toString(): string {
        return `[${this.toArray().map(e => e.toString()).join(", ")}]`
    }
}
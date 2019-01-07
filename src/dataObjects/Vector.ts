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

    /**
     * Makes a new vector with the same values
     * @returns {Vector} copy of this
     */
    public copy(): Vector {
        return new Vector(this.x, this.y);
    }

    /**
     * Grabs the values of the vector and puts them in an array
     * @returns {Array<number>} Array of x and y value of array
     */
    public toArray(): Array<number> {
        return [this.x, this.y]
    }

    /**
     * Gets the absolute size of the vector (pythagoras)
     * @returns {number} size
     */
    public getSize(): number {
        return Math.sqrt(this.x**2 + this.y**2);
    }

    /**
     * Adds the values of another vector to the values of myself
     * @param vector Vector to add
     * @returns {Vector} this
     */
    public add(vector: Vector): Vector {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    /**
     * Subtracts the values of another vector to the values of myself
     * @param vector Vector to subtract
     * @returns {Vector} this
     */
    public sub(vector: Vector): Vector {
        return this.add(vector.multiply(-1));
    }

    /**
     * Scales the vector by a given amount
     * @param scalar Number to scale vector by
     * @returns {Vector} this
     */
    public multiply(scalar: number): Vector {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    /**
     * Adjusts size of this vector to be 1
     * @returns {Vector} this
     */
    public normalize(): Vector {
        this.multiply(1/this.getSize());
        return this;
    }

    /**
     * Makes sure the absolute size of the vector does not exeed `n`
     * @param n Max size
     * @returns {Vector} this
     */
    public max(n: number): Vector {
        if (this.getSize() > n)
            this.multiply(n/this.getSize());
        return this;
    }

    /**
     * Makes sure the absolute size of the vector is bigger than `n`
     * @param n Min size
     * @returns {Vector} this
     */
    public min(n: number): Vector {
        if (this.getSize() < n)
            this.multiply(n/this.getSize());
        return this;
    }

    /**
     * Rotates this vector by a set amount
     * @param radians Angle in radians to rotate by
     * @returns {Vector} this
     */
    public rotate(radians: number): Vector {
        let myValue = this.toArray();
        let x = myValue[0],
            y = myValue[1];
        this.x = x*Math.cos(radians)-y*Math.sin(radians);
        this.y = x*Math.sin(radians)+y*Math.cos(radians);
        return this;
    }

    /**
     * Returns the values of the vector as a string
     * @returns {string} represents values of vector
     */
    public toString(): string {
        return `[${this.toArray().map(e => e.toString()).join(", ")}]`
    }
}
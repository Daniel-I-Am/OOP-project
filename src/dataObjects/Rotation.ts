class Rotation {
    private value: number;

    public constructor(
        value: number,
        isRadian: boolean = false,
    ) {
        if (isRadian)
            this.value = value;
        else
            this.value = MathHelper.toRadian(value);
    }

    /**
     * Gets the radian value of the rotation
     * @returns {number} radian value
     */
    public getValue(): number {
        return this.value;
    }

    /**
     * Gets the degree value of the rotation
     * @returns {number} degree value
     */
    public getDegree(): number {
        return this.value * (180 / Math.PI);
    }

    public copy(): Rotation {
        return new Rotation(this.getValue(), true);
    }
}
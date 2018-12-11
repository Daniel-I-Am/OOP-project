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

    public getValue(): number {
        return this.value;
    }
}
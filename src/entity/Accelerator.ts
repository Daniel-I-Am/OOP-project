class Accelerator extends Entity{
    private yeet: number;

    public constructor(
        imageSource: Array<string> = ["./assets/images/Anim_accelerator/1.png","./assets/images/Anim_accelerator/2.png", "./assets/images/Anim_accelerator/3.png"],
        location: Vector,
        rotation: Rotation,
        size: Vector,
        yeet: number
    ) {
        super(imageSource, location, rotation, size, undefined, undefined, undefined, undefined);
        this.animationCounterMax = 10;
        this.yeet = yeet;
    }

    protected move(): void{}

    public getRotation(): Rotation {
        return this.rotation;
    }

    public getYeet(): number {
        return this.yeet;
    }
}
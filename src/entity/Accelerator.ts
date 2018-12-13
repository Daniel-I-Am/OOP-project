class Accelerator extends Entity{

    public constructor(
        imageSource: Array<string> = ["./assets/images/Anim_accelerator/1.png","./assets/images/Anim_accelerator/2.png", "./assets/images/Anim_accelerator/3.png"],
        location: Vector,
        rotation: Rotation,
        size: Vector,
        gravity: number,
        acceleration: number
    ) {
        super(imageSource, location, rotation, size, gravity, undefined, undefined, acceleration);
        this.animationCounterMax = 10;
    }

    protected move(): void{

    }
}
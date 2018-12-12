class Accellerator extends Entity{

    public constructor(
        imageSource: Array<string> = ["./assets/images/Anim_accellerator/1.png","./assets/images/Anim_accellerator/2.png", "./assets/images/Anim_accellerator/3.png"],
        location: Vector,
        rotation: Rotation,
        size: Vector,
        gravity: number,
        speed: Vector
    ) {
        super(imageSource, location, rotation, size, gravity, speed);
        this.animationCounterMax = 10;
    }

    protected move(): void{

    }
}
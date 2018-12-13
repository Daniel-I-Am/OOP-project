class Trampoline extends Entity{

    public constructor(
        imageSource: Array<string> = ["./assets/images/trampoline.png"],
        location: Vector,
        rotation: Rotation,
        size: Vector,
        gravity: number,
    ) {
        super(imageSource, location, rotation, size, gravity, undefined, undefined);
        //this.animationCounterMax = 10;
    }

    protected move(): void{

    }
}
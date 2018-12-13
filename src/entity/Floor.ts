class Floor extends Entity {
    constructor(
        imageSource: string = "./assets/images/floorPlain.png",
        location: Vector,
        rotation: Rotation,
        size: Vector
    ) {
        super([imageSource], location, rotation, size);
    }

    protected move(): void {
        return; // Do nothing :)
    }
}
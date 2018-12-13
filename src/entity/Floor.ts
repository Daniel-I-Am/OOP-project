class Floor extends Entity {
    constructor(
        imageSource: string = null,
        location: Vector,
        rotation: Rotation,
        size: Vector
    ) {
        super(
            imageSource == null ? [] : [imageSource],
            location, rotation, size
        );
    }

    protected move(): void {
        return; // Do nothing :)
    }
}
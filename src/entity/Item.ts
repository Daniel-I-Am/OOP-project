class Item extends Entity {
    public name: string;

    /**
     * @constructor
     * @param {string} imageSource
     * @param {number} xPos
     * @param {number} yPos
     * @param {number} height
     * @param {number} width
     * @param {number} gravity
     * @param {number} acceleration
     */
    public constructor(
        imageSource: string,
        location: Vector,
        rotation: Rotation,
        size: Vector,
        name: string
    ) {
        super(
            [imageSource],
            location,
            rotation,
            size
        );
        this.name = name;
        this.collision = new CollisionObject(
            this.location.copy().sub(this.size.copy().multiply(.5)),
            this.location.copy().add(this.size.copy().multiply(.5)),
            this.rotation
        )
    }

    public move(): void {}
}

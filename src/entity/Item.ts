class Item extends Entity {
    private name: string;

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
    }

    public move(): void {}
}

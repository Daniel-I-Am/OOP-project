class Item extends Entity {
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
        size: Vector
    ) {
        super(
            [imageSource],
            location,
            rotation,
            size
        );  
    }

    public move(): void {}
}

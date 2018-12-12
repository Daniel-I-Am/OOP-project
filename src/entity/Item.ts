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
        xPos: number,
        yPos: number,
        height: number,
        width: number,
        gravity: number,
        acceleration: number
    ) {
        super(
            [imageSource],
            new Vector(xPos, yPos),
            new Rotation(0),
            new Vector(width, height),
            gravity,
            undefined,
            0,
            acceleration
        );
    }

    public move(): void {}
}

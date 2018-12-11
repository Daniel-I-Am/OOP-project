class Item extends Entity {
    /**
     * @constructor
     * @param {string} imageSource
     * @param {number} xPos
     * @param {number} yPos
     * @param {number} height
     * @param {number} width
     * @param {number} speed
     */
    constructor(
        imageSource: string,
        xPos: number,
        yPos: number,
        height: number,
        width: number,
        gravity: number,
        speed: number
    ) {
        super(
            imageSource,
            new Vector(xPos, yPos),
            new Rotation(0),
            new Vector(width, height),
            0,
            speed
        );
    }

    public move(): void {}
}

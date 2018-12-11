class Item extends Entity {
    /**
     * @constructor
     * @param {HTMLCanvasElement} canvas
     * @param {string} imageSource
     * @param {number} xPos
     * @param {number} yPos
     * @param {number} height
     * @param {number} width
     * @param {number} speed
     */
    constructor(
        canvas: HTMLCanvasElement,
        imageSource: string,
        xPos: number,
        yPos: number,
        height: number,
        width: number,
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
}

class Enemy extends Entity {
    /**
     * @constructor
     * @param {HTMLCanvasElement} canvas
     * @param {string} imageSource
     * @param {number} xPos
     * @param {number} yPos
     * @param {number} height
     * @param {number} width
     * @param {number} gravity
     * @param {number} speed
     */

    constructor(
        canvas: HTMLCanvasElement,
        imageSource: string,
        xPos: number,
        yPos: number,
        height: number,
        width: number,
        gravity: number,
        speed: number
    ) {
        super(
            [imageSource],
            new Vector(xPos, yPos),
            new Rotation(0),
            new Vector(width, height),
            gravity,
            speed
        );
    }


    /**
     * Function to move the enemy right
     */
    public moveRight() {
        this.location = this.location.add(new Vector(1, 0).multiply(this.speed));
    }

    /**
     * Function to move the enemy left
     */
    public moveLeft() {
        this.location = this.location.sub(new Vector(1, 0).multiply(this.speed));
    }

    /**
     *
     */
    protected move(): void {

    }
}

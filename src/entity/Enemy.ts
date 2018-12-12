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
     * @param {number} acceleration
     */

    public constructor(
        canvas: HTMLCanvasElement,
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
            2,
            acceleration
        );
    }


    /**
     * Function to move the enemy right
     */
    public moveRight() {
        this.velocity = new Vector(this.acceleration, 0)
    }

    /**
     * Function to move the enemy left
     */
    public moveLeft() {
        this.velocity = new Vector(this.acceleration, 0)
    }

    /**
     *
     */
    protected move(): void {
        this.location.add(this.velocity)
    }
}

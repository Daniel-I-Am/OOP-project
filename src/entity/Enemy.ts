class Enemy extends Entity {
    /**
     * @constructor
     * @param {HTMLCanvasElement} canvas
     * @param {string} imageSource
     * @param {number} xPos
     * @param {number} yPos
     * @param {number} height
     * @param {number} width
     * @param {number} speed
     * @param {number} gravity
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
            imageSource,
            new Vector(xPos, yPos),
            new Rotation(0),
            new Vector(width, height),
            speed,
            gravity
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
class Enemy extends Entity {
    private canvas: HTMLCanvasElement;
    private imageSource: string;
    private xPos: number;
    private yPos: number;
    private height: number;
    private width: number;
    private movementSpeed: number;


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
    constructor(canvas: HTMLCanvasElement, imageSource: string, xPos: number, yPos: number, height: number, width: number, movementSpeed: number) {
        super(canvas, imageSource, xPos, yPos, height, width, movementSpeed);
    }


    /**
     * Function to move the enemy right
     */
    public moveRight() {
        this.xPos += this.movementSpeed;
    }


    /**
     * Function to move the enemy left
     */
    public moveLeft() {
        this.xPos -= this.movementSpeed;
    }
}

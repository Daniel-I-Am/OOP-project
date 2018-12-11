class Enemey extends Entity {
    private canvas: HTMLCanvasElement;
    private imageSource: string;
    private xPos: number;
    private yPos: number;
    private height: number;
    private width: number;


    /**
     * @constructor
     * @param {HTMLCanvasElement} canvas
     * @param {string} imageSource
     * @param {number} xPos
     * @param {number} yPos
     * @param {number} height
     * @param {number} width
     */
    constructor(canvas: HTMLCanvasElement, imageSource: string, xPos: number, yPos: number, height: number, width: number) {
        super(canvas, imageSource, xPos, yPos, height, width);
    }
}

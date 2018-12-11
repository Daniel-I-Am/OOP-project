class CanvasHelper {
    private instance: CanvasHelper;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private constructor(
        canvas: HTMLElement
    ) {
        this.canvas = <HTMLCanvasElement>canvas;
        this.ctx = this.canvas.getContext('2d');
    }

    public Instance(canvas: HTMLElement = null) {
        if (!this.instance)
            this.instance = new CanvasHelper(canvas );
        return this.instance;
    }

    /**
     * Draws an image to the canvas
     * @param image Image to draw
     * @param location Location to draw the image at
     * @param rotation Amount to rotate the image
     * @param size Size of the image
     */
    public drawImage(
        image: HTMLImageElement,
        location: Vector,
        rotation: Rotation,
        size: Vector,
    ): void {
        this.ctx.save();
        this.ctx.translate(location.getValue(0), location.getValue(1));
        this.ctx.rotate(rotation.getValue());
        this.ctx.drawImage(image, -size.getValue(0)/2, -size.getValue(1)/2, size.getValue(0), size.getValue(1));
        this.ctx.restore();
    }
}
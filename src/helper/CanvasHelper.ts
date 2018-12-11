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
}
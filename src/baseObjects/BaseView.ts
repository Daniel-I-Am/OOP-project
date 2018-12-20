abstract class BaseView {
    protected canvasHelper: CanvasHelper;
    protected shouldClear: boolean;
    protected background: HTMLImageElement;

    protected constructor() {
        this.canvasHelper = CanvasHelper.Instance();
        this.shouldClear = true;
        this.background = new Image();
    }

    public tick(): void {
        this.drawBackground();
        this.update();
        this.drawGUI();
    }

    public getShouldClear(): boolean {
        return this.shouldClear;
    }

    /**
     * Draws background
     */
    protected drawBackground(): void {
        this.canvasHelper.drawImage(this.background, new Vector(0, 0), new Rotation(0), new Vector(-1, -1), false);
    }

    /**
     * Does whatever needs to be done in a tick
     * @abstract
     */
    protected abstract update(): void;

    /**
     * Seperated to drawing the GUI, this is te ensure the GUI is drawn on top of everything else
     * @abstract
     */
    protected abstract drawGUI(): void;

    /**
     * Do whatever needs to be done before this view is left
     * @abstract
     */
    public abstract beforeExit(): void;

    public abstract onPause(): void;
}
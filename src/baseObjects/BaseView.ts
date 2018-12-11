abstract class BaseView {
    protected canvasHelper: CanvasHelper;
    protected shouldClear: boolean;

    protected constructor() {
        this.canvasHelper = CanvasHelper.Instance();
        this.shouldClear = true;
    }

    public getShouldClear(): boolean {
        return this.shouldClear;
    }

    /**
     * Does whatever needs to be done in a tick
     * @abstract
     */
    public abstract update(): void;

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
}
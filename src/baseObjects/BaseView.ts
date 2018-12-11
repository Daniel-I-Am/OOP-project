abstract class BaseView {
    protected canvasHelper: CanvasHelper;

    protected constructor() {
        this.canvasHelper = CanvasHelper.Instance();
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
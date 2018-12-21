abstract class BaseView {
    public entities: Array<Entity>;
    public player: Player;
    protected canvasHelper: CanvasHelper;
    protected shouldClear: boolean;
    protected background: HTMLImageElement;

    protected constructor() {
        this.canvasHelper = CanvasHelper.Instance();
        this.shouldClear = true;
        this.background = new Image();
    }

    /**
     * Will be called every game tick, makes sure everything does what it has to do
     */
    public tick(): void {
        if (this.shouldClear)
            this.canvasHelper.clear();
        this.drawBackground();
        this.update();
        this.drawGUI();
    }

    /**
     * Draws background
     */
    protected drawBackground(): void {
        this.canvasHelper.drawImage(this.background, new Vector(0, 0), new Rotation(0), new Vector(-1, -1), undefined, false);
    }

    /**
     * Gets the background image
     * @returns {HTMLImageElement} background image
     */
    public getBackground(): HTMLImageElement {
        return this.background;
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

    /**
     * Called when the game is paused on an update
     * @abstract
     */
    public abstract onPause(): void;
}
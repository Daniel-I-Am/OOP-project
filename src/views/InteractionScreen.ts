class InteractionScreen extends DialogueView {
    public constructor(levelName: string) {
        super(levelName);
    }

    public drawGUI() {
        this.canvasHelper.writeText("asdf", 144, this.canvasHelper.getCenter(), undefined, undefined, "black")
    }

    protected onKey = (event: KeyboardEvent): void => {}
}
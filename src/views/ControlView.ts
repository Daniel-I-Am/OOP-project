class ControlView extends BaseView {
    public constructor() {
        super();
        this.shouldClear = false;
        this.canvasHelper.clear();

        "e - items oppakken\nesc - terug gaan\na/d/spatie/pijltje rechts en links - beweging".split("\n").forEach((e, i) => {
            this.canvasHelper.writeText(e, 44, this.canvasHelper.getCenter().add(new Vector(0, -100 * i)), undefined, undefined, "black");
        })

        window.addEventListener('keydown', this.onKey);
    }


    public onKey(event: KeyboardEvent) {
        console.log("asdasdasd")
        Game.switchView(new TitleView(() => {Game.pause(); Game.switchView(new LevelSelectView())}));
    }

    public drawGUI() {}
    public update() {}
    public onPause() {}
    
    public beforeExit() {
        this.canvasHelper.clear();
        console.log("asdasdasdasdasdwdasdasdasdf")
        window.removeEventListener('keydown', this.onKey);
    }
}
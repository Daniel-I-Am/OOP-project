class LevelSelectView extends BaseView {
    public constructor() {
        super();
        this.player = new MapPlayer();
    }

    public update() {
        this.player.update();
    }
    
    public beforeExit() {}
    public drawGUI() {}

    public onPause() {
        // just unpause right away
        Game.pause();
    }
}
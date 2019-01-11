class LevelSelectView extends BaseView {
    private backgroundMusic: SoundHelper;
    public constructor() {
        super();
        this.backgroundMusic = new SoundHelper("./assets/sounds/Pulsewave.wav", .3);
        this.backgroundMusic.toggleLoop();
        this.background = new Image();
        this.background.src = "./assets/images/level_select.png";
        this.entities = [];
        this.player = new MapPlayer(new Vector(40, 390));
        this.entities.push(this.player);
        this.canvasHelper.newOffset = new Vector(0, 0);
        // outside border
        this.entities.push(new CollisionObject(new Vector(-10, -10), new Vector(1610, 0), new Rotation(0)));
        this.entities.push(new CollisionObject(new Vector(-10, -10), new Vector(-10, 910), new Rotation(0)));
        this.entities.push(new CollisionObject(new Vector(-10, 900), new Vector(1610, 910), new Rotation(0)));
        this.entities.push(new CollisionObject(new Vector(1610, -10), new Vector(1610, 910), new Rotation(0)));

        // all rectangle surfaces
        this.entities.push(new CollisionObject(new Vector(0, 0), new Vector(500, 345), new Rotation(0)));
        this.entities.push(new CollisionObject(new Vector(500, 0), new Vector(1900, 57), new Rotation(0)));
        this.entities.push(new CollisionObject(new Vector(850, 57), new Vector(1900, 175), new Rotation(0)));
        this.entities.push(new CollisionObject(new Vector(500, 145), new Vector(750, 345), new Rotation(0)));
        this.entities.push(new CollisionObject(new Vector(600, 345), new Vector(750, 665), new Rotation(0)));
        this.entities.push(new CollisionObject(new Vector(750, 490), new Vector(900, 665), new Rotation(0)));
        this.entities.push(new CollisionObject(new Vector(900, 490), new Vector(1100, 780), new Rotation(0)));
        this.entities.push(new CollisionObject(new Vector(0, 690), new Vector(500, 900), new Rotation(0)));
        this.entities.push(new CollisionObject(new Vector(500, 750), new Vector(800, 900), new Rotation(0)));
        this.entities.push(new CollisionObject(new Vector(800, 865), new Vector(1200, 900), new Rotation(0)));
        this.entities.push(new CollisionObject(new Vector(1200, 750), new Vector(1600, 900), new Rotation(0)));
        this.entities.push(new CollisionObject(new Vector(1450, 665), new Vector(1600, 750), new Rotation(0)));
        this.entities.push(new CollisionObject(new Vector(1200, 260), new Vector(1600, 665), new Rotation(0)));
        this.entities.push(new CollisionObject(new Vector(850, 260), new Vector(1200, 410), new Rotation(0)));
        this.entities.push(new CollisionObject(new Vector(50, 435), new Vector(0, 700), new Rotation(0)));
        // triangles
        for (let x = 50; x<500; x++) {
            let y = 0.56666666666666667 * (x + 1) + 407;
            this.entities.push(new CollisionObject(new Vector(x, 700), new Vector(x+1, y), new Rotation(0)));
        }
        for (let x = 250; x<500; x++) {
            let y = 0.56666666666666667 * (x + 1) + 289;
            this.entities.push(new CollisionObject(new Vector(x, 432), new Vector(x+1, y), new Rotation(0)));
        }

        // level doors
        if (Game.DEBUG_MODE)
            this.entities.push(new MapDoor(new Vector(600, 350), "Debug Level", 'debug_level', "DoorCornerInv.png"));
        this.entities.push(new MapDoor(new Vector(300, 330), "Level 1", 'level_1'));
        this.entities.push(new MapDoor(new Vector(600, 560), "Level 2", 'level_2'));
        this.entities.push(new MapDoor(new Vector(750, 650), "Level 3", 'level_3'));
    }

    public update() {
        this.entities.forEach(e => {
            e.update();
            if (e instanceof MapDoor) {
                e.drawName();
            }
        });
    }

    public beforeExit() {
        this.backgroundMusic.pause(PlayingStat.PAUSED);
        this.player.removeKeyHelper();
    }

    public drawGUI() {
        this.canvasHelper.addProgressBar(
            new Vector(this.canvasHelper.getWidth()-100, 20),
            new Vector(180, 20),
            "green",
            "white",
            "black",
            Game.getReputation()
        );
    }

    public onPause() {
        // just unpause right away
        Game.pause();
    }
}

class DialogueView extends BaseView {
    public backgroundMusic: SoundHelper;
    protected dialogue: Array<DialogueLine>;
    protected endDialogue: Array<DialogueLine>;
    protected currentLine: number;
    private _listener: (event: KeyboardEvent) => void;
    private static fontSize: number;
    protected usedItems: Array<string>;

    public constructor(levelName: string) {
        super(levelName);
        this.backgroundMusic = new SoundHelper("./assets/sounds/Spectacles.wav", .3);
        this.backgroundMusic.toggleLoop();
        this.entities = new Array<Entity>();
        this.canvasHelper.newOffset = new Vector(0, 0);
        
        this.background = new Image();
        this.background.src = "./assets/images/map/room.png";
        fetch(`./assets/levels/${levelName}.json`)
            .then(response => {
                return response.json();
            })
            .then(myJson => {
                this.makeLevel(myJson);
            })
        this.currentLine = 0;
        DialogueView.fontSize = 30;

        this._listener = (event: KeyboardEvent) => {this.onKey(event)};

        window.addEventListener('keydown', this._listener);
    }

    private makeLevel(levelJSON: Level) {
        this.player = new Player(
            levelJSON.player.sprites,
            this.canvasHelper.getCenter().sub(new Vector(300, -50)),
            new Vector(levelJSON.player.size.x*3, levelJSON.player.size.y*3),
            levelJSON.player.gravity,
            2,
            levelJSON.player.jumpHeight,
            levelJSON.player.maxJumps
        );
        this.entities.push(
            new Player(
                levelJSON.patient.sprites,
                this.canvasHelper.getCenter().add(new Vector(300, 50)),
                new Vector(levelJSON.patient.size.x*3, levelJSON.patient.size.y*3),
                0, 2, 0, 0
            )
        );
        (<Player>this.entities[0]).removeKeyHelper();
        this.player.removeKeyHelper();
        
        this.dialogue = levelJSON.dialogue;

        this.endDialogue = levelJSON.endDialogue;

        this.usedItems = levelJSON.usedItems;

        this.entities.push(this.player);
    }

    public update() {
        this.entities.forEach(e => {
            e.draw();
        });
        this.canvasHelper.newOffset = new Vector(0, 0);
    }

    public displayLine() {
        this.canvasHelper.writeText(
            this.dialogue[this.currentLine].what,
            DialogueView.fontSize,
            ((who: "player" | "patient") => {
                switch(who) {
                    case "player":
                        return new Vector(this.canvasHelper.getCenter().x - 300, 250);
                    case "patient":
                        return new Vector(this.canvasHelper.getCenter().x + 300, 250);
                }
            })(this.dialogue[this.currentLine].who),
            undefined,
            undefined,
            "black"
        );
    }

    public drawGUI() {
        this.displayLine();
    }

    public onPause() {
        Game.pause();
    }

    public beforeExit() {
        this.backgroundMusic.pause(PlayingStat.PAUSED);
        window.removeEventListener('keydown', this._listener);
    }

    protected onKey = (event: KeyboardEvent): void => {
        if (event.keyCode == 13 || event.keyCode == 32) {
            this.currentLine ++;
            if (this.currentLine >=
                this.dialogue.length)
                Game.switchView(new GameView(this.levelName));
        }
    }
}
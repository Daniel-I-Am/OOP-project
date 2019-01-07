class DialogueView extends BaseView {
    private dialogue: Array<DialogueLine>;
    private currentLine: number;
    private levelName: string;
    private _listener: (event: KeyboardEvent) => void;

    public constructor(levelName: string) {
        super();
        this.entities = new Array<Entity>();
        this.levelName = levelName;
        fetch(`./assets/levels/${levelName}.json`)
            .then(response => {
                return response.json();
            })
            .then(myJson => {
                this.makeLevel(myJson);
            })
        this.currentLine = 0;

        this._listener = (event: KeyboardEvent) => {this.onKey(event)};

        window.addEventListener('keydown', this._listener);
    }

    private makeLevel(levelJSON: Level) {
        this.player = new Player(
            levelJSON.player.sprites,
            this.canvasHelper.getCenter().sub(new Vector(300, 0)),
            new Vector(levelJSON.player.size.x, levelJSON.player.size.y),
            levelJSON.player.gravity,
            2,
            levelJSON.player.jumpHeight,
            levelJSON.player.maxJumps
        );
        this.entities.push(
            new Player(
                levelJSON.patient.sprites,
                this.canvasHelper.getCenter().add(new Vector(300, 0)),
                new Vector(levelJSON.patient.size.x, levelJSON.patient.size.y),
                0, 2, 0, 0
            )
        );
        this.dialogue = levelJSON.dialogue;

        this.entities.push(this.player);
    }

    public update() {
        this.entities.forEach(e => {
            e.draw();
        });
        this.canvasHelper.offset = new Vector(0, 0);
    }

    public displayLine() {
        this.canvasHelper.writeText(
            this.dialogue[this.currentLine].what,
            96,
            ((who: "player" | "patient") => {
                switch(who) {
                    case "player":
                        return new Vector(this.canvasHelper.getCenter().x - 300, 300);
                    case "patient":
                        return new Vector(this.canvasHelper.getCenter().x + 300, 300);
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

    private onKey = (event: KeyboardEvent): void => {
        if (event.keyCode == 13) {
            this.currentLine++;
            if (this.currentLine >= this.dialogue.length)
                Game.switchView(new GameView(this.levelName));
        }
    }

    public onPause() {
        Game.pause();
    }

    public beforeExit() {
        window.removeEventListener('keydown', this._listener);
    }
}
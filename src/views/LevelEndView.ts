class LevelEndView extends DialogueView {

    private inventory: Array<InventoryItem>;
    private static FontSize: number;

    public constructor(levelName: string) {
        super(levelName);
        this.inventory = Game.getInventory()
        this.dialogue = this.endDialogue;
        LevelEndView.FontSize = 30;
    }

    public drawGUI() {
        this.inventory.forEach((e, i) => {
            this.canvasHelper.drawImage(e.image, new Vector(200, 200), new Rotation(0), new Vector(64, 64))
        })
        this.displayLine();
    }

    protected onKey = (event: KeyboardEvent): void => {
        if (event.keyCode == 13) {
            if (this.currentLine != 1) this.currentLine++;
            
        }
    }

    public beforeExit() {
        Game.clearInventory();
    }

    public displayLine() {
        this.canvasHelper.writeText(
            this.endDialogue[this.currentLine].what,
            LevelEndView.FontSize,
            ((who: "player" | "patient") => {
                switch(who) {
                    case "player":
                        return new Vector(this.canvasHelper.getCenter().x - 300, 300);
                    case "patient":
                        return new Vector(this.canvasHelper.getCenter().x + 300, 300);
                }
            })(this.endDialogue[this.currentLine].who),
            undefined,
            undefined,
            "black"
        );
    }

}

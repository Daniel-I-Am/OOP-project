class LevelEndView extends DialogueView {


    private inventory: Array<InventoryItem>;
    private static FontSize: number;
    private maxIndex: number;
    private indexToBeUsed: number;
    private selected: number;
    private currentItem: number;
    private lastUsedItem: InventoryItem;
    private healed: boolean;
    private shouldClearInventory: boolean = true;

    public constructor(levelName: string) {
        super(levelName);
        this.inventory = Game.getInventory();
        this.dialogue = this.endDialogue;
        LevelEndView.FontSize = 30;
        this.maxIndex = this.inventory.length;
        this.selected = 0;
        this.currentItem = 0;
        this.lastUsedItem = { id: 0, internalName: "none", displayName: "None", image: null }
        this.healed = false;
    }

    public drawGUI() {
        this.inventory.forEach((e, i) => {
            if (i == this.selected) {
                this.canvasHelper.drawImage(e.image, new Vector(210 + 70 * i, 200), new Rotation(0), new Vector(64, 64))
            } else {
                this.canvasHelper.drawImage(e.image, new Vector(210 + 70 * i, 175), new Rotation(0), new Vector(64, 64))
            }
        })
        this.displayLine();
        this.canvasHelper.addProgressBar(
            new Vector(this.canvasHelper.getWidth()-100, 20),
            new Vector(180, 20),
            "green",
            "white",
            "black",
            Game.getReputation()
        );
    }

    protected onKey = (event: KeyboardEvent): void => {
        console.log("onKey in LevelEndView", event.keyCode)
        if (event.keyCode == 13) {
            if (this.currentLine != 1) this.currentLine++;
            if (this.healed) Game.switchView(new LevelSelectView());
        } else if (event.keyCode == 69) {
            if (this.inventory[this.selected].internalName == this.usedItems[this.currentItem]) {
                this.currentItem++;
                this.currentLine = 2;
                this.lastUsedItem = this.inventory[this.selected];
                this.inventory.splice(this.selected, 1);
                this.selected = 0;
                Game.adjustReputation(-1.0);
                if (this.currentItem >= this.usedItems.length) {
                    this.currentLine = 4;
                    this.healed = true; 
                    this.backgroundMusic.pause(PlayingStat.PAUSED);
                    this.backgroundMusic = new SoundHelper("./assets/sounds/VICTORY.wav", .6);
                }

            } else {
                this.currentLine = 3;
                Game.adjustReputation(-0.1);
            }
        } else if (event.keyCode == 37) {
            if (this.selected > 0) this.selected--;

        } else if (event.keyCode == 39) {
            if (this.selected < this.maxIndex - 1) this.selected++;
        } else if (event.keyCode == 27) {
            this.shouldClearInventory = false;
            Game.switchView(new GameView(this.levelName, Game.getInventory()));
        }
    }

    public beforeExit() {
        super.beforeExit();
        if (this.shouldClearInventory)
            Game.clearInventory();
    }

    public displayLine() {
        this.canvasHelper.writeText(
            this.endDialogue[this.currentLine].what.replace("[ITEM]", this.lastUsedItem.displayName),
            LevelEndView.FontSize,
            ((who: "player" | "patient") => {
                switch (who) {
                    case "player":
                        return new Vector(this.canvasHelper.getCenter().x - 300, 250);
                    case "patient":
                        return new Vector(this.canvasHelper.getCenter().x + 300, 250);
                }
            })(this.endDialogue[this.currentLine].who),
            undefined,
            undefined,
            "black"
        );
    }

}

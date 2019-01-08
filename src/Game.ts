///<reference path="dataObjects/Enums.ts"/>
///<reference path="dataObjects/Interfaces.ts"/>
///<reference path="dataObjects/Rotation.ts"/>
///<reference path="dataObjects/Vector.ts"/>
///<reference path="helper/CanvasHelper.ts"/>
///<reference path="helper/KeyHelper.ts"/>
///<reference path="helper/MathHelper.ts"/>
///<reference path="helper/SoundHelper.ts"/>
///<reference path="baseObjects/BaseView.ts"/>
///<reference path="baseObjects/Entity.ts"/>
///<reference path="views/TitleView.ts"/>
///<reference path="views/GameView.ts"/>
///<reference path="views/GameOverView.ts"/>
///<reference path="entity/Accelerator.ts"/>
///<reference path="entity/CollisionObject.ts"/>
///<reference path="entity/Enemy.ts"/>
///<reference path="entity/Enemy_Bertha.ts"/>
///<reference path="entity/FallingTile.ts"/>
///<reference path="entity/Item.ts"/>
///<reference path="entity/Player.ts"/>
///<reference path="entity/Trampoline.ts"/>

class Game {
    private static instance: Game;
    private static inventory: Array<InventoryItem>;

    private canvasHelper: CanvasHelper;
    private static currentView: BaseView;
    private currentInterval: number;
    public static readonly DEBUG_MODE: boolean = (document.location.hostname != 'daniel-i-am.github.io');
    private static GAME_STATE: number = GameState.PAUSED;
    private static reputation: number;

    private constructor(canvas: HTMLElement) {
        Game.setReputation(0);
        this.canvasHelper = CanvasHelper.Instance(canvas);
        Game.currentView = new TitleView(
            () => {Game.pause(); Game.switchView(new LevelSelectView())}
        );
        this.currentInterval = setInterval(this.loop, 33);
    }

    public static Instance(canvas: HTMLElement = null): Game {
        if (!this.instance) this.instance = new Game(canvas)
        return this.instance;
    }

    private loop = (): void => {
        if (Game.GAME_STATE == GameState.PAUSED) {
            Game.currentView.onPause();
            return;
        }
        if (Game.currentView) {
            Game.currentView.tick();
        }
    }

    public static switchView = (
        newView: BaseView,
    ): void => {
        if (Game.currentView) {
            Game.currentView.beforeExit();
        }
        Game.currentView = newView;
    }

    public static getReputation(): number {
        return this.reputation;
    }

    private static setReputation(amount: number): void {
        this.reputation = amount;
    }

    public static pause() {
        if      (Game.GAME_STATE == GameState.PLAYING) Game.GAME_STATE = GameState.PAUSED;
        else if (Game.GAME_STATE == GameState.PAUSED) Game.GAME_STATE = GameState.PLAYING;
    }

    public static getBackground(): HTMLImageElement {
        return this.currentView.getBackground();
    }

    public static getCurrentView(): BaseView {
        return Game.currentView;
    }

    public static setInventory(newInventory: Array<InventoryItem>): void {
        this.inventory = newInventory;
    }

    public static getInventory(): Array<InventoryItem> {
        return this.inventory;
    }
}

function init() {
    Game.Instance(document.getElementById("canvas"));
}

window.addEventListener('load', init);
///<reference path="dataObjects/Enums.ts"/>
///<reference path="helper/CanvasHelper.ts"/>
///<reference path="helper/KeyHelper.ts"/>
///<reference path="helper/MathHelper.ts"/>
///<reference path="dataObjects/Rotation.ts"/>
///<reference path="dataObjects/Vector.ts"/>
///<reference path="baseObjects/BaseView.ts"/>
///<reference path="baseObjects/Entity.ts"/>
///<reference path="views/GameView.ts"/>
///<reference path="views/TitleView.ts"/>
///<reference path="entity/Enemy.ts"/>
///<reference path="entity/Item.ts"/>
///<reference path="entity/Player.ts"/>
///<reference path="entity/FallingTile.ts"/>

class Game {
    private static instance: Game;

    private canvasHelper: CanvasHelper;
    private static currentView: BaseView;
    private currentInterval: number;
    public static readonly DEBUG_MODE: boolean = true;
    private static GAME_STATE: number = GameState.PAUSED;
    private static reputation: number;

    private constructor(canvas: HTMLElement) {
        Game.setReputation(0);
        this.canvasHelper = CanvasHelper.Instance(canvas);
        Game.currentView = new TitleView(
            () => {Game.pause(); Game.switchView(new GameView("debug_level"))}
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
}

function init() {
    const game = Game.Instance(document.getElementById("canvas"));
}

window.addEventListener('load', init);
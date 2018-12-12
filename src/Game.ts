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
    private canvasHelper: CanvasHelper;
    private currentView: BaseView;
    private currentInterval: number;

    public constructor(canvas: HTMLElement) {
        this.canvasHelper = CanvasHelper.Instance(canvas);
        this.currentView = new TitleView(
            () => {this.switchView(new GameView())}
        );
        this.currentInterval = setInterval(this.loop, 33);
    }

    private loop = (): void => {
        if (this.currentView) {
            if (this.currentView.getShouldClear())
                this.canvasHelper.clear();
            this.currentView.update();
        }
    }

    private switchView = (
        newView: BaseView,
    ): void => {
        if (this.currentView) {
            this.currentView.beforeExit();
        }
        this.currentView = newView;
    }
}

function init() {
    const game = new Game(document.getElementById("canvas"));
}

window.addEventListener('load', init);
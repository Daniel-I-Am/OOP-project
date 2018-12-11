///<reference path="helper/CanvasHelper.ts"/>
///<reference path="helper/KeyHelper.ts"/>
///<reference path="helper/MathHelper.ts"/>
///<reference path="dataObjects/Rotation.ts"/>
///<reference path="dataObjects/Vector.ts"/>
///<reference path="baseObjects/BaseView.ts"/>
///<reference path="baseObjects/Entity.ts"/>
///<reference path="entity/Enemy.ts"/>

class Game {
    private currentView: BaseView;
    private currentInterval: number;
    public constructor(canvas: HTMLElement) {
    }

    private loop = (): void => {
        if (this.currentView)
            this.currentView.update();
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
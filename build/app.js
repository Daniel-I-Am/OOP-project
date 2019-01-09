var PlayingStat;
(function (PlayingStat) {
    PlayingStat[PlayingStat["PLAYING"] = 0] = "PLAYING";
    PlayingStat[PlayingStat["PAUSED"] = 1] = "PAUSED";
    PlayingStat[PlayingStat["STOPPED"] = 2] = "STOPPED";
})(PlayingStat || (PlayingStat = {}));
var GameState;
(function (GameState) {
    GameState[GameState["PAUSED"] = 0] = "PAUSED";
    GameState[GameState["PLAYING"] = 1] = "PLAYING";
})(GameState || (GameState = {}));
class Rotation {
    constructor(value, isRadian = false) {
        if (isRadian)
            this.value = value;
        else
            this.value = MathHelper.toRadian(value);
    }
    getValue() {
        return this.value;
    }
    getDegree() {
        return this.value * (180 / Math.PI);
    }
    copy() {
        return new Rotation(this.getValue(), true);
    }
}
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    copy() {
        return new Vector(this.x, this.y);
    }
    toArray() {
        return [this.x, this.y];
    }
    getSize() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }
    sub(vector) {
        return this.add(vector.multiply(-1));
    }
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    normalize() {
        this.multiply(1 / this.getSize());
        return this;
    }
    max(n) {
        if (this.getSize() > n)
            this.multiply(n / this.getSize());
        return this;
    }
    min(n) {
        if (this.getSize() < n)
            this.multiply(n / this.getSize());
        return this;
    }
    rotate(radians) {
        let myValue = this.toArray();
        let x = myValue[0], y = myValue[1];
        this.x = x * Math.cos(radians) - y * Math.sin(radians);
        this.y = x * Math.sin(radians) + y * Math.cos(radians);
        return this;
    }
    toString() {
        return `[${this.toArray().map(e => e.toString()).join(", ")}]`;
    }
}
class CanvasHelper {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.offset = new Vector(0, 0);
        this.canvas.style.width = `${this.canvas.clientWidth}px`;
        this.canvas.style.height = `${this.canvas.clientWidth * 9 / 16}px`;
        this.canvas.width = 1600;
        this.canvas.height = 900;
    }
    static Instance(canvas = null) {
        if (!this.instance)
            this.instance = new CanvasHelper(canvas);
        return this.instance;
    }
    clear() {
        this.ctx.clearRect(0, 0, this.getWidth(), this.getHeight());
    }
    writeText(text, fontsize, location, align = "center", baseLine = "middle", color = "white", fontFamily = "Arial") {
        this.ctx.fillStyle = color;
        this.ctx.font = `${fontsize}px ${fontFamily}`;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = baseLine;
        this.ctx.fillText(text, location.x, location.y);
    }
    fillRect(topLeft, bottomRight, color) {
        this.ctx.save();
        this.ctx.fillStyle = color;
        this.ctx.fillRect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
        this.ctx.restore();
    }
    addProgressBar(location, size, filledColor, emptyColor, outlineColor, filledPct) {
        filledPct = Math.min(Math.max(filledPct, 0), 1);
        this.fillRect(location.copy().sub(size.copy().multiply(.5)), location.copy().add(size.copy().multiply(.5)), outlineColor);
        this.fillRect(location.copy().sub(size.copy().multiply(.5)).add(new Vector(1, 1)), location.copy().add(size.copy().multiply(.5)).sub(new Vector(1, 1)), emptyColor);
        this.fillRect(location.copy().sub(size.copy().multiply(.5)).add(new Vector(1, 1)), new Vector(location.x - size.x * .5 + 1 + filledPct * (size.x - 1), location.y + size.y * .5 - 1), filledColor);
    }
    drawImage(image, location, rotation, size, scale = new Vector(1, 1), isCentered = true, isGUI = false, opacity = 1) {
        this.ctx.save();
        this.ctx.globalAlpha = opacity;
        if (!isGUI) {
            this.ctx.translate(location.x - this.offset.x, location.y - this.offset.y);
        }
        else {
            this.ctx.translate(location.x, location.y);
        }
        this.ctx.rotate(rotation.getValue());
        this.ctx.scale(scale.x, scale.y);
        if (Math.min(...size.toArray()) < 0) {
            if (isCentered)
                this.ctx.drawImage(image, -image.width / 2, -image.height / 2);
            else
                this.ctx.drawImage(image, 0, 0);
        }
        else {
            if (isCentered)
                this.ctx.drawImage(image, -size.x / 2, -size.y / 2, size.x, size.y);
            else
                this.ctx.drawImage(image, 0, 0, size.x, size.y);
        }
        this.ctx.restore();
    }
    drawButton(image, caption, fontSize, location, size, callback = null) {
        this.drawImage(image, location, new Rotation(0), size);
        this.writeText(caption, fontSize, location, "center", "middle", "black");
        if (!callback)
            return;
        let _listener = (event) => {
            let croppingFactor = this.getCroppingFactor();
            let xScale = size.x / image.width;
            let yScale = size.y / image.height;
            let topleft = new Vector(this.canvas.offsetLeft + croppingFactor.x * (location.x - xScale * image.width / 2), this.canvas.offsetTop + croppingFactor.y * (location.y - yScale * image.height / 2)), bottomRight = new Vector(this.canvas.offsetLeft + croppingFactor.y * (location.x + xScale * image.width / 2), this.canvas.offsetTop + croppingFactor.y * (location.y + yScale * image.height / 2));
            if (event.x < bottomRight.x && event.x > topleft.x && event.y < bottomRight.y && event.y > topleft.y) {
                this.canvas.removeEventListener('click', _listener);
                callback(event);
            }
        };
        this.canvas.addEventListener('click', _listener);
    }
    getSize() {
        return [this.getWidth(), this.getHeight()];
    }
    getCenter() {
        return new Vector(this.getWidth() / 2, this.getHeight() / 2);
    }
    getWidth() {
        return this.canvas.width;
    }
    getHeight() {
        return this.canvas.height;
    }
    getCroppingFactor() {
        return new Vector(this.canvas.clientWidth / this.canvas.width, this.canvas.clientHeight / this.canvas.height);
    }
}
class KeyHelper {
    constructor() {
        this.keyDownHandler = (event) => {
            switch (event.keyCode) {
                case 37:
                case 65:
                    this.leftPressed = true;
                    break;
                case 38:
                case 87:
                    this.upPressed = true;
                    break;
                case 39:
                case 68:
                    this.rightPressed = true;
                    break;
                case 40:
                case 83:
                    this.downPressed = true;
                    break;
                case 32:
                    this.spaceBarPressed = true;
                    break;
                case 69:
                    this.interactPressed = true;
                    break;
            }
            if (event.keyCode >= 48 && event.keyCode <= 57)
                this.numberKeys[event.keyCode - 48] = true;
        };
        this.keyUpHandler = (event) => {
            switch (event.keyCode) {
                case 37:
                case 65:
                    this.leftPressed = false;
                    break;
                case 38:
                case 87:
                    this.upPressed = false;
                    break;
                case 39:
                case 68:
                    this.rightPressed = false;
                    break;
                case 40:
                case 83:
                    this.downPressed = false;
                    break;
                case 32:
                    this.spaceBarPressed = false;
                    break;
                case 69:
                    this.interactPressed = false;
                    break;
            }
            if (event.keyCode >= 48 && event.keyCode <= 57)
                this.numberKeys[event.keyCode - 48] = false;
        };
        this.leftPressed = false;
        this.upPressed = false;
        this.rightPressed = false;
        this.downPressed = false;
        this.spaceBarPressed = false;
        this.interactPressed = false;
        this.numberKeys = {
            1: false, 2: false, 3: false, 4: false, 5: false,
            6: false, 7: false, 8: false, 9: false, 0: false,
        };
        window.addEventListener("keydown", this.keyDownHandler);
        window.addEventListener("keyup", this.keyUpHandler);
    }
    destroy() {
        window.removeEventListener("keydown", this.keyDownHandler);
        window.removeEventListener("keyup", this.keyUpHandler);
        this.leftPressed = false;
        this.rightPressed = false;
        this.upPressed = false;
        this.downPressed = false;
        this.spaceBarPressed = false;
        this.interactPressed = false;
    }
    getLeftPressed() {
        return this.leftPressed;
    }
    getUpPressed() {
        return this.upPressed;
    }
    getRightPressed() {
        return this.rightPressed;
    }
    getDownPressed() {
        return this.downPressed;
    }
    getSpaceBarPressed() {
        return this.spaceBarPressed;
    }
    getInteractPressed() {
        return this.interactPressed;
    }
    resetSpaceBar() {
        this.spaceBarPressed = false;
    }
}
class MathHelper {
    static randomNumber(min, max, digits = 0) {
        return Math.floor(Math.random() * (max - min) * Math.pow(10, digits) + min) / Math.pow(10, digits);
    }
    static toRadian(degrees) {
        return degrees * Math.PI / 180;
    }
    static floor(n, digits) {
        return Math.floor(n * (Math.pow(10, digits))) / (Math.pow(10, digits));
    }
}
class SoundHelper {
    constructor(src, volume = 1) {
        this.audioElem = document.createElement("audio");
        this.audioElem.setAttribute("preload", "auto");
        this.audioElem.setAttribute("controls", "none");
        this.audioElem.style.display = "none";
        this.state = PlayingStat.PLAYING;
        this.audioElem.src = src;
        this.audioElem.volume = volume;
        this.audioElem.play();
    }
    play() {
        this.audioElem.play();
    }
    toggleLoop() {
        this.audioElem.loop = !this.audioElem.loop;
    }
    pause(state = null) {
        if (this.state == PlayingStat.STOPPED)
            return;
        if (state) {
            switch (state) {
                case PlayingStat.PLAYING:
                    this.audioElem.play();
                    break;
                case PlayingStat.PAUSED:
                    this.audioElem.pause();
                    break;
            }
            return;
        }
        if (this.state == PlayingStat.PLAYING) {
            this.state = PlayingStat.PAUSED;
            this.audioElem.pause();
        }
        else if (this.state == PlayingStat.PAUSED) {
            this.state = PlayingStat.PLAYING;
            this.audioElem.play();
        }
    }
}
class BaseView {
    constructor(levelName = null) {
        this.canvasHelper = CanvasHelper.Instance();
        this.shouldClear = true;
        this.background = new Image();
        this.levelName = levelName;
    }
    tick() {
        if (this.shouldClear)
            this.canvasHelper.clear();
        this.drawBackground();
        this.update();
        this.drawGUI();
    }
    drawBackground() {
        this.canvasHelper.drawImage(this.background, new Vector(0, 0), new Rotation(0), new Vector(-1, -1), undefined, false);
    }
    getBackground() {
        return this.background;
    }
}
class Entity {
    constructor(imageSources = ["./assets/images/default.png"], location, rotation, size, gravity = 0, velocity = new Vector(0, 0), acceleration = 0, maxSpeed = 0, direction = new Rotation(0)) {
        this.shouldCollide = true;
        this.drawOnDeath = true;
        this.isAlive = true;
        this.canvasHelper = CanvasHelper.Instance();
        this.images = new Array();
        this.activeImage = 0;
        this.animationCounter = 0;
        this.animationCounterMax = 1;
        imageSources.forEach(e => {
            let image = new Image();
            image.src = e;
            this.images.push(image);
        });
        this.location = location;
        this.offset = new Vector(0, 0);
        this.rotation = rotation;
        this.size = size;
        if (Math.min(...this.size.toArray()) < 0)
            this.images[0].addEventListener('load', () => {
                this.size = new Vector(this.images[0].width, this.images[0].height);
            });
        this.gravity = gravity;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.maxSpeed = maxSpeed;
        this.direction = direction;
        this.collision = null;
    }
    collide(collideWith) {
        if (this.collision == null || collideWith.getCollision() == null)
            return false;
        return this.collision.collide(collideWith.getCollision());
    }
    getCollision() {
        return this.collision;
    }
    removeCollision() {
        this.collision = null;
    }
    update(entities = null) {
        this.move(entities);
        if (this.getCollision()) {
            if (!(this instanceof CollisionObject)) {
                this.getCollision().updateLocation(this.location);
            }
            this.getCollision().draw();
        }
        this.animationCounter++;
        this.animationCounter %= this.animationCounterMax;
        if (this.animationCounter == 0)
            this.activeImage = (this.activeImage + 1) % this.images.length;
        if (this.drawOnDeath || this.isAlive) {
            this.draw();
            if (this instanceof Player)
                this.drawOverlay();
        }
    }
    ;
    draw() {
        if (this.images.length <= 0)
            return;
        this.canvasHelper.drawImage(this.images[this.activeImage], this.location.copy().add(this.offset), this.rotation, this.size, (this.velocity.x < 0 ? new Vector(-1, 1) : undefined));
    }
    getSize() {
        return this.size;
    }
    getLoc() {
        return this.location;
    }
    getVelocity() {
        return this.velocity;
    }
    getRot() {
        return this.rotation;
    }
    getAlive() {
        return this.isAlive;
    }
    kill() {
        this.isAlive = false;
    }
    revive() {
        this.isAlive = true;
    }
}
class DialogueView extends BaseView {
    constructor(levelName) {
        super(levelName);
        this.onKey = (event) => {
            if (event.keyCode == 13) {
                this.currentLine++;
                if (this.currentLine >=
                    this.dialogue.length)
                    Game.switchView(new GameView(this.levelName));
            }
        };
        this.entities = new Array();
        fetch(`./assets/levels/${levelName}.json`)
            .then(response => {
            return response.json();
        })
            .then(myJson => {
            this.makeLevel(myJson);
        });
        this.currentLine = 0;
        DialogueView.fontSize = 30;
        this._listener = (event) => { this.onKey(event); };
        window.addEventListener('keydown', this._listener);
    }
    makeLevel(levelJSON) {
        this.player = new Player(levelJSON.player.sprites, this.canvasHelper.getCenter().sub(new Vector(300, 0)), new Vector(levelJSON.player.size.x, levelJSON.player.size.y), levelJSON.player.gravity, 2, levelJSON.player.jumpHeight, levelJSON.player.maxJumps);
        this.entities.push(new Player(levelJSON.patient.sprites, this.canvasHelper.getCenter().add(new Vector(300, 0)), new Vector(levelJSON.patient.size.x, levelJSON.patient.size.y), 0, 2, 0, 0));
        this.dialogue = levelJSON.dialogue;
        this.endDialogue = levelJSON.endDialogue;
        this.usedItems = levelJSON.usedItems;
        this.entities.push(this.player);
    }
    update() {
        this.entities.forEach(e => {
            e.draw();
        });
        this.canvasHelper.offset = new Vector(0, 0);
    }
    displayLine() {
        this.canvasHelper.writeText(this.dialogue[this.currentLine].what, DialogueView.fontSize, ((who) => {
            switch (who) {
                case "player":
                    return new Vector(this.canvasHelper.getCenter().x - 300, 300);
                case "patient":
                    return new Vector(this.canvasHelper.getCenter().x + 300, 300);
            }
        })(this.dialogue[this.currentLine].who), undefined, undefined, "black");
    }
    drawGUI() {
        this.displayLine();
    }
    onPause() {
        Game.pause();
    }
    beforeExit() {
        window.removeEventListener('keydown', this._listener);
    }
}
class GameOverView extends BaseView {
    constructor(player, entities, background, levelName) {
        super(levelName);
        this.player = player;
        this.background = background;
        this.entities = entities.filter(e => !(e instanceof CollisionObject));
        this.entities.forEach(e => {
            e.removeCollision();
        });
    }
    update() {
        this.entities.forEach(e => {
            e.draw();
        });
        this.player.update();
        console.log(this.player['isLanded']);
        if (this.player.getLoc().y > this.canvasHelper.offset.y + 3000) {
            Game.switchView(new GameView(this.levelName));
        }
    }
    drawGUI() {
        for (let i = 0; i < 85; i++) {
            this.canvasHelper.fillRect(new Vector(0, this.canvasHelper.getCenter().y - 50 - i), new Vector(this.canvasHelper.getWidth(), this.canvasHelper.getCenter().y - 51 - i), `rgba(0, 0, 0, ${(85 - i) / 100})`);
            this.canvasHelper.fillRect(new Vector(0, this.canvasHelper.getCenter().y + 51 + i), new Vector(this.canvasHelper.getWidth(), this.canvasHelper.getCenter().y + 50 + i), `rgba(0, 0, 0, ${(85 - i) / 100})`);
        }
        this.canvasHelper.fillRect(new Vector(0, this.canvasHelper.getCenter().y - 50), new Vector(this.canvasHelper.getWidth(), this.canvasHelper.getCenter().y + 50), `rgba(0, 0, 0, ${85 / 100})`);
        this.canvasHelper.writeText("Game over!", 96, this.canvasHelper.getCenter(), undefined, undefined, "red");
        this.canvasHelper.addProgressBar(new Vector(this.canvasHelper.getWidth() - 100, 20), new Vector(180, 20), "green", "white", "black", Game.getReputation());
    }
    beforeExit() { }
    onPause() { }
}
class GameView extends BaseView {
    constructor(levelName) {
        super(levelName);
        this.entities = new Array();
        fetch(`./assets/levels/${levelName}.json`)
            .then(response => {
            return response.json();
        })
            .then(myJson => {
            this.makeLevel(myJson);
        });
    }
    makeLevel(levelJSON) {
        this.background.src = levelJSON.background;
        this.backgroundMusic = new SoundHelper(levelJSON.backgroundMusic, .3);
        this.backgroundMusic.toggleLoop();
        levelJSON.Collisions.forEach(e => {
            this.entities.push(new CollisionObject(this.parseLocation(e.topLeft), this.parseLocation(e.bottomRight), new Rotation(e.rotation)));
        });
        this.player = new Player(levelJSON.player.sprites, this.parseLocation(levelJSON.player.location), new Vector(levelJSON.player.size.x, levelJSON.player.size.y), levelJSON.player.gravity, 2, levelJSON.player.jumpHeight, levelJSON.player.maxJumps);
        levelJSON.berthas.forEach(e => {
            this.entities.push(new Enemy_Bertha(((e.sprites == null) ? undefined : e.sprites), this.parseLocation(e.location), new Vector(e.size.x, e.size.y), e.gravity));
        });
        levelJSON.Fires.forEach(e => {
            this.entities.push(new Fire(((e.sprites == null) ? undefined : e.sprites), this.parseLocation(e.location), new Rotation(0), new Vector(e.size.x, e.size.y), 0));
        });
        levelJSON.FallingTiles.forEach(e => {
            this.entities.push(new FallingTile(((e.sprites == null) ? undefined : e.sprites), this.parseLocation(e.location), new Rotation(e.rotation), new Vector(e.size.x, e.size.y), 2, 0));
        });
        levelJSON.Accelerators.forEach(e => {
            this.entities.push(new Accelerator(((e.sprites == null) ? undefined : e.sprites), this.parseLocation(e.location), new Rotation(e.rotation), new Vector(e.size.x, e.size.y), e.yeet));
        });
        levelJSON.Trampolines.forEach(e => {
            this.entities.push(new Trampoline(((e.sprites == null) ? undefined : e.sprites), this.parseLocation(e.location), new Rotation(e.rotation), new Vector(e.size.x, e.size.y), 2, ((e.shouldDraw == null) ? true : e.shouldDraw)));
        });
        levelJSON.items.forEach(e => {
            this.entities.push(new Item(this.parseLocation(e.location), new Rotation(e.rotation), new Vector(e.size.x, e.size.y), e.name));
        });
        this.entities.push(new Door(this.parseLocation(levelJSON.door.bottomRight), this.parseLocation(levelJSON.door.topLeft)));
        this.entities.push(this.player);
    }
    parseLocation(location) {
        return new Vector((location.x.center ? this.canvasHelper.getCenter().x : 0) + location.x.offset, (location.y.center ? this.canvasHelper.getCenter().y : 0) + location.y.offset);
    }
    update() {
        this.entities.forEach(e => {
            e.update(this.entities);
        });
    }
    drawGUI() {
        if (Game.DEBUG_MODE) {
            this.canvasHelper.writeText(`XPos: ${MathHelper.floor(this.player.getLoc().x, 2)}`, 20, new Vector(50, 20), "left", undefined, "black");
            this.canvasHelper.writeText(`YPos: ${MathHelper.floor(this.player.getLoc().y, 2)}`, 20, new Vector(50, 40), "left", undefined, "black");
            this.canvasHelper.writeText(`XVelo: ${MathHelper.floor(this.player.getVelocity().x, 2)}`, 20, new Vector(50, 60), "left", undefined, "black");
            this.canvasHelper.writeText(`YVelo: ${MathHelper.floor(this.player.getVelocity().y, 2)}`, 20, new Vector(50, 80), "left", undefined, "black");
        }
        this.canvasHelper.addProgressBar(new Vector(this.canvasHelper.getWidth() - 100, 20), new Vector(180, 20), "green", "white", "black", Game.getReputation());
    }
    reachedDoor() {
        Game.setInventory(this.player.getInventory());
        Game.switchView(new LevelEndView(this.levelName));
    }
    beforeExit() {
        this.backgroundMusic.pause(PlayingStat.PAUSED);
    }
    onPause() {
        this.canvasHelper.writeText("PAUSED", 96, this.canvasHelper.getCenter(), "center", "middle", "black");
    }
}
class LevelEndView extends DialogueView {
    constructor(levelName) {
        super(levelName);
        this.onKey = (event) => {
            if (event.keyCode == 13) {
                if (this.currentLine != 1)
                    this.currentLine++;
                if (this.healed)
                    Game.switchView(new LevelSelectView());
            }
            else if (event.keyCode == 69) {
                if (this.inventory[this.selected].internalName == this.usedItems[this.currentItem]) {
                    this.currentItem++;
                    this.currentLine = 2;
                    this.lastUsedItem = this.inventory[this.selected];
                    this.inventory.splice(this.selected, 1);
                    this.selected = 0;
                    if (this.currentItem >= this.usedItems.length) {
                        this.currentLine = 4;
                        this.healed = true;
                    }
                }
                else {
                    this.currentLine = 3;
                }
            }
            else if (event.keyCode == 37) {
                if (this.selected > 0)
                    this.selected--;
            }
            else if (event.keyCode == 39) {
                if (this.selected < this.maxIndex - 1)
                    this.selected++;
            }
        };
        this.inventory = Game.getInventory();
        this.dialogue = this.endDialogue;
        LevelEndView.FontSize = 30;
        this.maxIndex = this.inventory.length;
        this.selected = 0;
        this.currentItem = 0;
        this.lastUsedItem = { id: 0, internalName: "none", displayName: "None", image: null };
        this.healed = false;
    }
    drawGUI() {
        this.inventory.forEach((e, i) => {
            if (i == this.selected) {
                this.canvasHelper.drawImage(e.image, new Vector(200 + 100 * i, 225), new Rotation(0), new Vector(64, 64));
            }
            else {
                this.canvasHelper.drawImage(e.image, new Vector(200 + 100 * i, 200), new Rotation(0), new Vector(64, 64));
            }
        });
        this.displayLine();
    }
    beforeExit() {
        Game.clearInventory();
        window.removeEventListener('onkey', this.onKey);
    }
    displayLine() {
        this.canvasHelper.writeText(this.endDialogue[this.currentLine].what.replace("[ITEM]", this.lastUsedItem.displayName), LevelEndView.FontSize, ((who) => {
            switch (who) {
                case "player":
                    return new Vector(this.canvasHelper.getCenter().x - 300, 300);
                case "patient":
                    return new Vector(this.canvasHelper.getCenter().x + 300, 300);
            }
        })(this.endDialogue[this.currentLine].who), undefined, undefined, "black");
    }
}
class LevelSelectView extends BaseView {
    constructor() {
        super();
        this.background = new Image();
        this.background.src = "./assets/images/level_select.png";
        this.entities = [];
        this.player = new MapPlayer(new Vector(40, 390));
        this.entities.push(this.player);
        this.entities.push(new CollisionObject(new Vector(-10, -10), new Vector(1610, 0), new Rotation(0)));
        this.entities.push(new CollisionObject(new Vector(-10, -10), new Vector(-10, 910), new Rotation(0)));
        this.entities.push(new CollisionObject(new Vector(-10, 900), new Vector(1610, 910), new Rotation(0)));
        this.entities.push(new CollisionObject(new Vector(1610, -10), new Vector(1610, 910), new Rotation(0)));
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
        for (let x = 50; x < 500; x++) {
            let y = 0.56666666666666667 * (x + 1) + 407;
            this.entities.push(new CollisionObject(new Vector(x, 700), new Vector(x + 1, y), new Rotation(0)));
        }
        for (let x = 250; x < 500; x++) {
            let y = 0.56666666666666667 * (x + 1) + 289;
            this.entities.push(new CollisionObject(new Vector(x, 432), new Vector(x + 1, y), new Rotation(0)));
        }
        if (Game.DEBUG_MODE)
            this.entities.push(new MapDoor(new Vector(600, 350), "Debug Level", 'debug_level', "DoorCornerInv.png"));
        this.entities.push(new MapDoor(new Vector(300, 330), "Level 1", 'level_1'));
        if (Game.DEBUG_MODE)
            document.getElementById("canvas").addEventListener('click', (e) => {
                let target = e.target;
                console.log((e.x - target.offsetLeft) / (target.clientWidth / 1600), (e.y - target.offsetTop) / (target.clientHeight / 900));
            });
    }
    update() {
        this.entities.forEach(e => {
            e.update();
            if (e instanceof MapDoor) {
                e.drawName();
            }
        });
    }
    beforeExit() { }
    drawGUI() {
        this.canvasHelper.addProgressBar(new Vector(this.canvasHelper.getWidth() - 100, 20), new Vector(180, 20), "green", "white", "black", Game.getReputation());
    }
    onPause() {
        Game.pause();
    }
}
class TitleView extends BaseView {
    constructor(buttonCallback) {
        super();
        this.active = true;
        this.shouldClear = false;
        let buttonImage = new Image();
        buttonImage.addEventListener('load', () => {
            this.canvasHelper.drawButton(buttonImage, "Play!", 96, this.canvasHelper.getCenter(), new Vector(buttonImage.width * 5, buttonImage.height * 5), buttonCallback);
        });
        buttonImage.src = "./assets/images/buttonGreen.png";
        let _listener = () => {
            window.removeEventListener('mousemove', _listener);
            if (!this.active)
                return;
            this.menuMusic = new SoundHelper("./assets/sounds/CupcakeRain.mp3");
            this.menuMusic.toggleLoop();
        };
        window.addEventListener('mousemove', _listener);
    }
    update() { }
    drawGUI() { }
    beforeExit() {
        this.active = false;
        if (this.menuMusic)
            this.menuMusic.pause();
    }
    onPause() { }
}
class Accelerator extends Entity {
    constructor(imageSource = ["./assets/images/Anim_accelerator/1.png", "./assets/images/Anim_accelerator/2.png", "./assets/images/Anim_accelerator/3.png"], location, rotation, size, yeet) {
        super(imageSource, location, rotation, size, undefined, undefined, undefined, undefined);
        this.animationCounterMax = 10;
        this.yeet = yeet;
        this.collision = new CollisionObject(this.location.copy().sub(this.size.copy().multiply(.5)), this.location.copy().add(this.size.copy().multiply(.5)), this.rotation);
        this.shouldCollide = false;
    }
    move() { }
    getYeet() {
        return this.yeet;
    }
    onPlayerCollision(player, collisionSides) {
        if (this.collide(player))
            player.boost(this);
    }
}
class CollisionObject extends Entity {
    constructor(topLeft, bottomRight, rotation, onCollide = null) {
        let textures = (Game.DEBUG_MODE ? ["./assets/images/default.png"] : []);
        super(textures, new Vector((topLeft.x + bottomRight.x) / 2, (topLeft.y + bottomRight.y) / 2), rotation, new Vector(Math.abs(bottomRight.x - topLeft.x), Math.abs(bottomRight.y - topLeft.y)), undefined, undefined, undefined, undefined, new Rotation(0));
        this.collideFunction = onCollide;
        this.collision = this;
    }
    onCollide(entity) {
        if (this.collideFunction)
            this.collideFunction(entity);
    }
    updateLocation(location) {
        this.location = location;
    }
    collide(collideWith) {
        if (this.location.x - this.size.x / 2 - collideWith.getSize().x / 2 < collideWith.getLoc().x &&
            this.location.x + this.size.x / 2 + collideWith.getSize().x / 2 > collideWith.getLoc().x &&
            this.location.y - this.size.y / 2 - collideWith.getSize().y / 2 < collideWith.getLoc().y &&
            this.location.y + this.size.y / 2 + collideWith.getSize().y / 2 > collideWith.getLoc().y)
            return true;
        return false;
    }
    move() { }
    onPlayerCollision(player, collisionSides) {
        return;
    }
}
class Door extends Entity {
    constructor(bottomRight, topLeft) {
        let size = bottomRight.copy().sub(topLeft.copy());
        size.x = Math.abs(size.x);
        size.y = Math.abs(size.y);
        super([], bottomRight.copy().add(topLeft.copy()).multiply(.5), new Rotation(0), size);
        this.shouldCollide = false;
        this.collision = new CollisionObject(topLeft.copy(), bottomRight.copy(), new Rotation(0));
    }
    move() { }
    onPlayerCollision(player, collisionSides) {
        this.canvasHelper.writeText("Druk op e om het level te verlaten", 48, this.location.copy().add(new Vector(0, -200)).sub(this.canvasHelper.offset.copy()), undefined, undefined, "black");
    }
}
class Enemy_Bertha extends Entity {
    constructor(imageSources = [
        "./assets/bertha/anim_walk/1.png",
        "./assets/bertha/anim_walk/2.png",
        "./assets/bertha/anim_walk/1.png",
        "./assets/bertha/anim_walk/3.png"
    ], location, size, gravity) {
        super(imageSources, location, new Rotation(0), size, gravity, undefined, 2);
        this.walkSpeed = 3;
        this.landed = false;
        this.collision = new CollisionObject(this.location.copy().sub(this.size.copy().multiply(.5)), this.location.copy().add(this.size.copy().multiply(.5)), this.rotation);
        this.velocity.x = this.walkSpeed;
        this.animationCounterMax = 4;
    }
    move(entities) {
        this.landed = false;
        entities.forEach(e => {
            if (this.collide(e) && e !== this) {
                this.landed = true;
            }
        });
        if (!this.landed) {
            this.velocity.x *= -1;
        }
        else {
            this.velocity.y = 0;
        }
        this.location.add(this.velocity);
        entities.forEach(e => {
            if (this.collide(e) && e !== this) {
                this.landed = true;
            }
        });
        if (!this.landed) {
            this.velocity.y += this.gravity;
        }
    }
    onPlayerCollision(player, collisionSides) {
        if (collisionSides.left || collisionSides.right || collisionSides.top || collisionSides.bottom)
            player.kill();
    }
}
class Enemy extends Entity {
    constructor(canvas, imageSource, xPos, yPos, height, width, gravity, acceleration) {
        super([imageSource], new Vector(xPos, yPos), new Rotation(0), new Vector(width, height), gravity, undefined, 2, acceleration);
    }
    move() {
        this.location.add(this.velocity);
    }
    onPlayerCollision(player, _) {
        if (this.collide(player))
            player.kill();
    }
}
class FallingTile extends Entity {
    constructor(imageSource = ["./assets/images/fallingTile1.png"], location, rotation, size, gravity, acceleration) {
        super(imageSource, location, rotation, size, gravity, undefined, undefined, acceleration);
        this.countdown = 60;
        this.falling = false;
        this.alive = true;
        this.activated = false;
        this.collision = new CollisionObject(this.location.copy().sub(this.size.copy().multiply(.5)), this.location.copy().add(this.size.copy().multiply(.5)), this.rotation);
    }
    move(entites) {
        if (this.activated) {
            this.countdown -= 1;
        }
        if (this.countdown == 0) {
            this.falling = true;
        }
        if (this.alive && this.falling) {
            this.offset.y = 0;
            this.velocity.y += this.gravity;
            entites.forEach(e => {
                if (e.collide(this)) {
                    if (e == this)
                        return;
                    if (e instanceof Player)
                        return;
                    if (e instanceof Enemy_Bertha)
                        return;
                    this.alive = false;
                }
            });
            this.location.add(this.velocity);
        }
        if (!this.falling && this.activated) {
            this.offset.y = MathHelper.randomNumber(-2, 2, 2);
        }
    }
    getFalling() {
        return this.falling;
    }
    kill() {
        this.alive = false;
    }
    getAlive() {
        return this.alive;
    }
    onPlayerCollision(player, collisionSides) {
        if (collisionSides.bottom)
            this.activated = true;
    }
}
class Fire extends Entity {
    constructor(imageSources = ["./assets/images/fire.png"], location, rotation, size, gravity) {
        super(imageSources, location, rotation, size, gravity, undefined, undefined);
        this.collision = new CollisionObject(this.location.copy().sub(this.size.copy().multiply(.5)), this.location.copy().add(this.size.copy().multiply(.5)), this.rotation);
        this.shouldCollide = false;
    }
    move() { }
    onPlayerCollision(player, collisionSides) {
        if (this.collide(player)) {
            player.incFireCounter();
            if (player.getFireCounter() >= 150) {
                player.kill();
            }
            console.log("FAYAA");
        }
    }
}
class Item extends Entity {
    constructor(location, rotation, size, name, gravity = 0) {
        let itemData = (Item.itemIDs.map((e) => {
            if (e.internalName == name)
                return e;
            return null;
        })).filter(e => {
            return e;
        })[0] || Item.itemIDs[0];
        super([itemData.spriteSrc], location, rotation, size, gravity);
        this.drawOnDeath = false;
        this.shouldCollide = false;
        this.itemData = itemData;
        this.itemID = Item.itemIDs.map((e, i) => {
            if (e === itemData)
                return i;
            return 0;
        }).reduce((s, e) => { return s + e; });
        this.collision = new CollisionObject(this.location.copy().sub(this.size.copy().multiply(.5)), this.location.copy().add(this.size.copy().multiply(.5)), this.rotation);
    }
    move() {
        const d = new Date();
        this.offset.y = 5 * Math.sin((1000 * d.getSeconds() + d.getMilliseconds()) * 0.0008 * Math.PI);
        this.velocity.y += this.gravity;
        Game.getCurrentView().entities.forEach(e => {
            if (e === this)
                return;
            if (e.collide(this))
                this.velocity.y = 0;
        });
        this.location.add(this.velocity);
    }
    getItemID() {
        return this.itemID;
    }
    onPlayerCollision(player, collisionSides) {
        return;
    }
    removeHitBox() {
        this.collision = null;
    }
}
Item.itemIDs = [
    { internalName: "none", displayName: "None", spriteSrc: null },
    { internalName: "bandage", displayName: "Een pleister", spriteSrc: "./assets/images/items/bandage.png" },
    { internalName: "citroen", displayName: "Een citroen", spriteSrc: "./assets/images/items/citroen.png" },
    { internalName: "jodium", displayName: "Jodium", spriteSrc: "./assets/images/items/jodium.png" },
    { internalName: "keukenrol", displayName: "Keukenrol", spriteSrc: "./assets/images/items/keukenrol.png" },
    { internalName: "water", displayName: "Water", spriteSrc: "./assets/images/items/water.png" }
];
class MapDoor extends Entity {
    constructor(location, levelName, internalName, imageSrc = 'Door.png') {
        super([`./assets/images/${imageSrc}`], location, new Rotation(0), new Vector(28, 56));
        this.levelName = levelName;
        this.internalName = internalName;
        this.collision = new CollisionObject(this.location.copy().add(this.size.copy().multiply(.5)), this.location.copy().sub(this.size.copy().multiply(.5)), this.rotation);
    }
    move() { }
    onPlayerCollision() {
        Game.switchView(new DialogueView(this.internalName));
    }
    drawName() {
        this.canvasHelper.writeText(this.levelName, 24, this.location.copy().sub(new Vector(0, 50)), undefined, undefined, "green");
    }
}
class Player extends Entity {
    constructor(imageSources, location, size, gravity, acceleration, jumpHeight, maxJumps) {
        super(imageSources, location, new Rotation(0), size, gravity, undefined, acceleration, 15);
        this.darkOverlay = new Image();
        this.darkOverlay.src = "./assets/player/darkOverlay.png";
        this.keyHelper = new KeyHelper();
        this.animationCounterMax = 4;
        this.isJumping = false;
        this.isLanded = false;
        this.inventory = new Array();
        this.maxJumps = maxJumps;
        this.jumpCount = 0;
        this.jumpSpeed = jumpHeight;
        this.isAlive = true;
        this.fireCounter = 0;
        this.collision = new CollisionObject(this.location.copy().sub(this.size.copy().multiply(.5).add(new Vector(5, 5))), this.location.copy().add(this.size.copy().multiply(.5)).sub(new Vector(5, 5)), this.rotation);
        this.canvasHelper.offset.x -= this.canvasHelper.offset.x + this.canvasHelper.getWidth() / 2 - this.location.x;
        this.canvasHelper.offset.y -= this.canvasHelper.offset.y + this.canvasHelper.getHeight() / 2 - this.location.y;
        this.leftCollision = new CollisionObject(this.location.copy().add(new Vector(-this.size.x / 2, -this.size.y / 2 + 1)), this.location.copy().add(new Vector(-this.size.x / 2, this.size.y / 2 - 40)), this.rotation);
        this.rightCollision = new CollisionObject(this.location.copy().add(new Vector(this.size.x / 2, -this.size.y / 2 + 1)), this.location.copy().add(new Vector(this.size.x / 2, this.size.y / 2 - 40)), this.rotation);
        this.bottomCollision = new CollisionObject(this.location.copy().add(new Vector(-this.size.x / 8, this.size.y / 2)), this.location.copy().add(new Vector(this.size.x / 8, this.size.y / 2)), this.rotation);
        this.topCollision = new CollisionObject(this.location.copy().add(new Vector(-this.size.x / 8, -this.size.x / 2)), this.location.copy().add(new Vector(this.size.x / 8, -this.size.x / 2)), this.rotation);
        this.previousCollision = { left: false, right: false, top: false, bottom: false };
    }
    move() {
        let collision = this.playerCollision(Game.getCurrentView().entities);
        if (this.keyHelper.getLeftPressed() && this.velocity.x > -this.maxSpeed) {
            this.velocity.x -= this.acceleration;
        }
        if (this.keyHelper.getRightPressed() && this.velocity.x < this.maxSpeed) {
            this.velocity.x += this.acceleration;
        }
        if (this.isLanded)
            this.jumpCount = 0;
        if (this.keyHelper.getSpaceBarPressed() && this.jumpCount < this.maxJumps)
            this.jump();
        this.velocity.y += this.gravity;
        if (this.isLanded) {
            this.velocity.y = Math.min(this.velocity.y, 0);
            if (!(this.keyHelper.getLeftPressed() ||
                this.keyHelper.getRightPressed())) {
                this.velocity.x *= .60;
            }
        }
        if (collision.left) {
            if (!this.previousCollision.left)
                this.velocity.x = Math.max(this.velocity.x, this.velocity.x / 2);
            else
                this.velocity.x = Math.max(this.velocity.x, 0);
        }
        if (collision.right) {
            if (!this.previousCollision.right)
                this.velocity.x = Math.min(this.velocity.x, this.velocity.x / 2);
            else
                this.velocity.x = Math.min(this.velocity.x, 0);
        }
        if (collision.top) {
            if (!this.previousCollision.top)
                this.velocity.y = Math.max(this.velocity.y, this.velocity.y / 2);
            else
                this.velocity.y = Math.max(this.velocity.y, 0);
        }
        if (collision.bottom) {
            if (!this.previousCollision.bottom)
                this.velocity.y = Math.min(this.velocity.y, this.velocity.y / 2);
            else
                this.velocity.y = Math.min(this.velocity.y, 0);
        }
        this.previousCollision = collision;
        this.location.add(this.velocity);
        if (this.isAlive) {
            let dx = this.canvasHelper.offset.x + this.canvasHelper.getWidth() / 2 - this.location.x;
            let dy = this.canvasHelper.offset.y + this.canvasHelper.getHeight() / 2 - this.location.y;
            this.canvasHelper.offset.x -= 1 * Math.pow(10, -17) * Math.pow(dx, 7);
            this.canvasHelper.offset.y -= 1 * Math.pow(10, -17) * Math.pow(dy, 7);
            if (isNaN(this.canvasHelper.offset.x)) {
                this.canvasHelper.offset.x = -this.canvasHelper.getWidth() / 2 + this.location.x;
                console.log("Reset x", this.canvasHelper.offset.x);
            }
            if (isNaN(this.canvasHelper.offset.y)) {
                this.canvasHelper.offset.y = -this.canvasHelper.getHeight() / 2 + this.location.y;
                console.log("Reset y", this.canvasHelper.offset.y);
            }
        }
        if (this.location.y > 5000)
            this.kill();
        this.checkInventory();
        this.drawInventory();
        this.fireCounter = Math.max(0, this.fireCounter - 0.083333333333);
    }
    playerCollision(collideWith) {
        this.leftCollision.updateLocation(this.location.copy().add(new Vector(-this.size.x / 2, 0)));
        this.rightCollision.updateLocation(this.location.copy().add(new Vector(this.size.x / 2, 0)));
        this.topCollision.updateLocation(this.location.copy().add(new Vector(0, -this.size.y / 2)));
        this.bottomCollision.updateLocation(this.location.copy().add(new Vector(0, this.size.y / 2)));
        let returnValue = { left: false, right: false, bottom: false, top: false };
        if (collideWith == null || !this.isAlive)
            return returnValue;
        collideWith.forEach(e => {
            if (e instanceof Player)
                return;
            this.interact(e);
            if (!e.shouldCollide) {
                if (e.collide(this))
                    e.onPlayerCollision(this, null);
                return;
            }
            let thisEntityCollision = { left: false, right: false, top: false, bottom: false };
            thisEntityCollision.left = e.collide(this.leftCollision);
            thisEntityCollision.right = e.collide(this.rightCollision);
            thisEntityCollision.bottom = e.collide(this.bottomCollision);
            thisEntityCollision.top = e.collide(this.topCollision);
            e.onPlayerCollision(this, thisEntityCollision);
            if (e instanceof Trampoline && e.collide(this.bottomCollision)) {
                thisEntityCollision.bottom = false;
            }
            if (e instanceof Accelerator) {
                return;
            }
            returnValue.left = thisEntityCollision.left || returnValue.left;
            returnValue.right = thisEntityCollision.right || returnValue.right;
            returnValue.bottom = thisEntityCollision.bottom || returnValue.bottom;
            returnValue.top = thisEntityCollision.top || returnValue.top;
            if (thisEntityCollision.left && thisEntityCollision.right && thisEntityCollision.bottom)
                this.location.y--;
        });
        if (returnValue.bottom && this.velocity.y >= 0) {
            this.isLanded = true;
        }
        else {
            this.isLanded = false;
        }
        return returnValue;
    }
    boost(booster) {
        this.velocity = new Vector(booster.getYeet(), 0).rotate(booster.getRot().getValue());
    }
    trampoline(entity) {
        new SoundHelper("./assets/sounds/jump.wav");
        this.velocity = new Vector(this.velocity.x, -this.velocity.y - 5).rotate(entity.getRot().getValue());
    }
    jump() {
        new SoundHelper("./assets/sounds/jump.wav");
        this.velocity.y -= this.jumpSpeed;
        this.keyHelper.resetSpaceBar();
        this.jumpCount++;
    }
    interact(entity) {
        if (this.keyHelper.getInteractPressed() && this.collide(entity) && entity instanceof Item && entity.getAlive()) {
            entity.kill();
            entity.removeHitBox();
            this.newInventoryItem(entity.getItemID());
        }
        else if (this.keyHelper.getInteractPressed() && this.collide(entity) && entity instanceof Door) {
            let currentView = Game.getCurrentView();
            if (currentView instanceof GameView)
                currentView.reachedDoor();
        }
    }
    newInventoryItem(id) {
        let img = new Image();
        img.src = Item.itemIDs[id].spriteSrc;
        this.inventory.push({
            id: id,
            internalName: Item.itemIDs[id].internalName,
            displayName: Item.itemIDs[id].displayName,
            image: img
        });
    }
    checkInventory() {
        for (let i = 0; i < 10; i++) {
            if (this.keyHelper.numberKeys[i]) {
                this.keyHelper.numberKeys[i] = false;
                const droppedItem = this.inventory.splice(i - 1, 1)[0];
                if (droppedItem) {
                    Game.getCurrentView().entities.push(new Item(this.location.copy(), this.rotation.copy(), new Vector(64, 64), droppedItem.internalName, this.gravity));
                }
            }
        }
    }
    drawInventory() {
        this.inventory.slice().reverse().forEach((e, i) => {
            this.canvasHelper.drawImage(e.image, new Vector(this.canvasHelper.getWidth() - 50 * (i + 1), 70), new Rotation(0), new Vector(50, 50), undefined, true, true);
        });
    }
    drawOverlay() {
        this.canvasHelper.drawImage(this.darkOverlay, this.location, this.rotation, this.size, (this.velocity.x < 0 ? new Vector(-1, 1) : undefined), undefined, undefined, this.fireCounter / 150 * .6);
    }
    setIsLanded(state) {
        this.isLanded = state;
    }
    kill() {
        if (!this.isAlive)
            return;
        this.keyHelper.destroy();
        this.setIsLanded(true);
        this.isAlive = false;
        new SoundHelper("./assets/sounds/GameOver.wav");
        this.velocity.x = 0;
        this.velocity.y = 0;
        let oldGravity = this.gravity;
        this.gravity = 0;
        setTimeout(() => {
            this.setIsLanded(false);
            this.gravity = oldGravity;
            this.velocity.y = -20;
        }, 1750);
        Game.adjustReputation(-.2);
        Game.switchView(new GameOverView(this, Game.getCurrentView().entities, Game.getBackground(), Game.getCurrentView().levelName));
    }
    onPlayerCollision(player, collisionSides) {
        return;
    }
    incFireCounter() {
        this.fireCounter++;
    }
    getFireCounter() {
        return this.fireCounter;
    }
    getInventory() {
        return this.inventory;
    }
}
class MapPlayer extends Player {
    constructor(location) {
        super(["./assets/player/mapPlayer.png"], location, new Vector(48, 48), 0, 0, 0, 0);
        this.maxSpeed = 5;
        this.canvasHelper.offset = new Vector(0, 0);
    }
    move() {
        this.velocity = new Vector(0, 0);
        if (this.keyHelper.leftPressed)
            this.velocity.x = -this.maxSpeed;
        if (this.keyHelper.rightPressed)
            this.velocity.x = this.maxSpeed;
        if (this.keyHelper.upPressed)
            this.velocity.y = -this.maxSpeed;
        if (this.keyHelper.downPressed)
            this.velocity.y = this.maxSpeed;
        this.location.add(this.velocity);
        this.collision.updateLocation(this.location);
        Game.getCurrentView().entities.forEach(e => {
            if (e === this)
                return;
            if (e.collide(this)) {
                e.onPlayerCollision(this, null);
                this.location.sub(this.velocity);
                this.velocity = new Vector(0, 0);
            }
        });
    }
}
class Trampoline extends Entity {
    constructor(imageSource = ["./assets/images/trampoline.png"], location, rotation, size, gravity, shouldDraw = true) {
        if (!shouldDraw)
            imageSource = [];
        super(imageSource, location, rotation, size, gravity, undefined, undefined);
        this.collision = new CollisionObject(this.location.copy().sub(this.size.copy().multiply(.5)), this.location.copy().add(this.size.copy().multiply(.5)), this.rotation);
    }
    move() { }
    onPlayerCollision(player, collisionSides) {
        if (collisionSides.bottom)
            player.trampoline(this);
    }
}
class Game {
    constructor(canvas) {
        this.loop = () => {
            if (Game.GAME_STATE == GameState.PAUSED) {
                Game.currentView.onPause();
                return;
            }
            if (Game.currentView) {
                Game.currentView.tick();
            }
        };
        Game.setReputation(0);
        this.canvasHelper = CanvasHelper.Instance(canvas);
        Game.currentView = new TitleView(() => { Game.pause(); Game.switchView(new LevelSelectView()); });
        this.currentInterval = setInterval(this.loop, 33);
    }
    static Instance(canvas = null) {
        if (!this.instance)
            this.instance = new Game(canvas);
        return this.instance;
    }
    static getReputation() {
        return this.reputation;
    }
    static setReputation(amount) {
        this.reputation = amount;
    }
    static adjustReputation(amount) {
        let n = setInterval(() => { this.reputation += amount / 100; }, 10);
        setTimeout(() => { clearInterval(n); }, 1001);
    }
    static pause() {
        if (Game.GAME_STATE == GameState.PLAYING)
            Game.GAME_STATE = GameState.PAUSED;
        else if (Game.GAME_STATE == GameState.PAUSED)
            Game.GAME_STATE = GameState.PLAYING;
    }
    static getBackground() {
        return this.currentView.getBackground();
    }
    static getCurrentView() {
        return Game.currentView;
    }
    static setInventory(newInventory) {
        this.inventory = newInventory;
    }
    static getInventory() {
        return this.inventory;
    }
    static clearInventory() {
        this.inventory = [];
    }
    static useItem(n) {
        return this.inventory.splice(n, 1)[0];
    }
}
Game.DEBUG_MODE = (document.location.hostname != 'daniel-i-am.github.io');
Game.GAME_STATE = GameState.PAUSED;
Game.switchView = (newView) => {
    if (Game.currentView) {
        Game.currentView.beforeExit();
    }
    Game.currentView = newView;
};
function init() {
    Game.Instance(document.getElementById("canvas"));
}
window.addEventListener('load', init);
//# sourceMappingURL=app.js.map
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
    drawImage(image, location, rotation, size, isCentered = true) {
        this.ctx.save();
        this.ctx.translate(location.x - this.offset.x, location.y - this.offset.y);
        this.ctx.rotate(rotation.getValue());
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
        };
        this.leftPressed = false;
        this.upPressed = false;
        this.rightPressed = false;
        this.downPressed = false;
        this.spaceBarPressed = false;
        this.interactPressed = false;
        window.addEventListener("keydown", this.keyDownHandler);
        window.addEventListener("keyup", this.keyUpHandler);
    }
    destroy() {
        window.removeEventListener("keydown", this.keyDownHandler);
        window.removeEventListener("keyup", this.keyUpHandler);
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
class BaseView {
    constructor() {
        this.canvasHelper = CanvasHelper.Instance();
        this.shouldClear = true;
        this.background = new Image();
    }
    tick() {
        this.drawBackground();
        this.update();
        this.drawGUI();
    }
    getShouldClear() {
        return this.shouldClear;
    }
    drawBackground() {
        this.canvasHelper.drawImage(this.background, new Vector(0, 0), new Rotation(0), new Vector(-1, -1), false);
    }
}
class Entity {
    constructor(imageSources = ["./assets/images/default.png"], location, rotation, size, gravity = 0, velocity = new Vector(0, 0), acceleration = 0, maxSpeed = 0, direction = new Rotation(0)) {
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
    update() {
        this.move();
        if (!(this instanceof CollisionObject)) {
            this.getCollision().updateLocation(this.location);
        }
        this.getCollision().draw();
        this.animationCounter++;
        this.animationCounter %= this.animationCounterMax;
        if (this.animationCounter == 0)
            this.activeImage = (this.activeImage + 1) % this.images.length;
        this.draw();
    }
    ;
    draw() {
        if (this.images.length <= 0)
            return;
        this.canvasHelper.drawImage(this.images[this.activeImage], this.location.copy().add(this.offset), this.rotation, this.size);
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
}
class GameView extends BaseView {
    constructor(levelName, switchView) {
        super();
        this.entities = new Array();
        this.switchView = switchView;
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
        levelJSON.Collisions.forEach(e => {
            this.entities.push(new CollisionObject(this.parseLocation(e.topLeft), this.parseLocation(e.bottomRight), new Rotation(e.rotation)));
        });
        this.player = new Player(levelJSON.player.sprites, this.parseLocation(levelJSON.player.location), new Vector(levelJSON.player.size.x, levelJSON.player.size.y), levelJSON.player.gravity, 2, this.switchView);
        levelJSON.FallingTiles.forEach(e => {
            this.entities.push(new FallingTile(((e.sprites == null) ? undefined : e.sprites), this.parseLocation(e.location), new Rotation(e.rotation), new Vector(e.size.x, e.size.y), 2, 0));
        });
        levelJSON.Accelerators.forEach(e => {
            this.entities.push(new Accelerator(((e.sprites == null) ? undefined : e.sprites), this.parseLocation(e.location), new Rotation(e.rotation), new Vector(e.size.x, e.size.y), e.yeet));
        });
        levelJSON.Trampolines.forEach(e => {
            this.entities.push(new Trampoline(((e.sprites == null) ? undefined : e.sprites), this.parseLocation(e.location), new Rotation(e.rotation), new Vector(e.size.x, e.size.y), 2));
        });
        levelJSON.items.forEach(e => {
            this.entities.push(new Item(((e.sprite == null) ? undefined : e.sprite), this.parseLocation(e.location), new Rotation(e.rotation), new Vector(e.size.x, e.size.y), e.name));
        });
        this.entities.push(this.player);
    }
    parseLocation(location) {
        return new Vector((location.x.center ? this.canvasHelper.getCenter().x : 0) + location.x.offset, (location.y.center ? this.canvasHelper.getCenter().y : 0) + location.y.offset);
    }
    update() {
        this.player.setIsLanded(false);
        this.entities.forEach(e => {
            if (e === this.player)
                return;
            if (this.player.footCollision(e)) {
                this.player.setIsLanded(true);
                if (e instanceof FallingTile) {
                    e.activated = true;
                }
            }
            if (e.collide(this.player)) {
                if (e instanceof Accelerator) {
                    this.player.boost(e);
                }
                if (e.collide(this.player) && e instanceof Trampoline) {
                    this.player.trampoline();
                }
                this.player.interact(e);
            }
            if (e instanceof FallingTile) {
                if (e.getAlive() && e.getFalling()) {
                    let tile = e;
                    this.entities.forEach(e => {
                        if (!(e instanceof CollisionObject))
                            return;
                        if (e.collide(tile.getCollision())) {
                            tile.kill();
                        }
                    });
                }
            }
        });
        this.entities.forEach(e => {
            e.update();
        });
    }
    drawGUI() {
        if (Game.DEBUG_MODE) {
            this.canvasHelper.writeText(`XPos: ${MathHelper.floor(this.player.getLoc().x, 2)}`, 20, new Vector(50, 20), "left", undefined, "black");
            this.canvasHelper.writeText(`YPos: ${MathHelper.floor(this.player.getLoc().y, 2)}`, 20, new Vector(50, 40), "left", undefined, "black");
            this.canvasHelper.writeText(`XVelo: ${MathHelper.floor(this.player.getVelocity().x, 2)}`, 20, new Vector(50, 60), "left", undefined, "black");
            this.canvasHelper.writeText(`YVelo: ${MathHelper.floor(this.player.getVelocity().y, 2)}`, 20, new Vector(50, 80), "left", undefined, "black");
        }
    }
    beforeExit() { }
}
class TitleView extends BaseView {
    constructor(buttonCallback) {
        super();
        this.shouldClear = false;
        let buttonImage = new Image();
        buttonImage.addEventListener('load', () => {
            this.canvasHelper.drawButton(buttonImage, "Play!", 96, this.canvasHelper.getCenter(), new Vector(buttonImage.width * 5, buttonImage.height * 5), buttonCallback);
        });
        buttonImage.src = "./assets/images/buttonGreen.png";
    }
    update() { }
    drawGUI() { }
    beforeExit() { }
}
class Enemy extends Entity {
    constructor(canvas, imageSource, xPos, yPos, height, width, gravity, acceleration) {
        super([imageSource], new Vector(xPos, yPos), new Rotation(0), new Vector(width, height), gravity, undefined, 2, acceleration);
    }
    moveRight() {
        this.velocity = new Vector(this.acceleration, 0);
    }
    moveLeft() {
        this.velocity = new Vector(this.acceleration, 0);
    }
    move() {
        this.location.add(this.velocity);
    }
}
class Item extends Entity {
    constructor(imageSource, location, rotation, size, name) {
        super([imageSource], location, rotation, size);
        this.name = name;
        this.collision = new CollisionObject(this.location.copy().sub(this.size.copy().multiply(.5)), this.location.copy().add(this.size.copy().multiply(.5)), this.rotation);
    }
    move() { }
}
class Player extends Entity {
    constructor(imageSources, location, size, gravity, acceleration, switchView) {
        super(imageSources, location, new Rotation(0), size, gravity, undefined, acceleration, 15);
        this.keyHelper = new KeyHelper();
        this.animationCounterMax = 4;
        this.isJumping = false;
        this.isLanded = false;
        this.inventory = new Array();
        this.jumpSpeed = 30;
        this.switchView = switchView;
        this.collision = new CollisionObject(this.location.copy().sub(this.size.copy().multiply(.5)), this.location.copy().add(this.size.copy().multiply(.5)).sub(new Vector(0, 20)), this.rotation);
        this.canvasHelper.offset.x -= this.canvasHelper.offset.x + this.canvasHelper.getWidth() / 2 - this.location.x;
        this.canvasHelper.offset.y -= this.canvasHelper.offset.y + this.canvasHelper.getHeight() / 2 - this.location.y;
    }
    move() {
        if (this.keyHelper.getLeftPressed() && this.velocity.x > -this.maxSpeed) {
            this.velocity.x -= this.acceleration;
        }
        if (this.keyHelper.getRightPressed() && this.velocity.x < this.maxSpeed) {
            this.velocity.x += this.acceleration;
        }
        if (this.keyHelper.getSpaceBarPressed() && this.isLanded) {
            this.velocity.y -= this.jumpSpeed;
        }
        this.velocity.y += this.gravity;
        if (this.isLanded) {
            this.velocity.y = Math.min(this.velocity.y, 0);
            if (!(this.keyHelper.getLeftPressed() ||
                this.keyHelper.getRightPressed())) {
                this.velocity.x *= .60;
            }
        }
        this.location.add(this.velocity);
        var dx = this.canvasHelper.offset.x + this.canvasHelper.getWidth() / 2 - this.location.x;
        var dy = this.canvasHelper.offset.y + this.canvasHelper.getHeight() / 2 - this.location.y;
        this.canvasHelper.offset.x -= 1 * Math.pow(10, -17) * Math.pow(dx, 7);
        this.canvasHelper.offset.y -= 1 * Math.pow(10, -17) * Math.pow(dy, 7);
        if (this.location.y > 5000)
            this.kill();
    }
    footCollision(collideWith) {
        let other = collideWith.getCollision();
        if (other == null)
            return false;
        if (this.location.x - 1 - other.getSize().x / 2 < other.getLoc().x &&
            this.location.x + 1 + other.getSize().x / 2 > other.getLoc().x &&
            this.location.y + this.size.y / 2 - 20 - other.getSize().y / 2 < other.getLoc().y &&
            this.location.y + this.size.y / 2 - 20 + other.getSize().y / 2 > other.getLoc().y)
            return true;
        return false;
    }
    boost(booster) {
        this.velocity = new Vector(booster.getYeet(), 0).rotate(booster.getRotation().getValue());
    }
    trampoline() {
        this.velocity = new Vector(this.velocity.x, -this.velocity.y - 5);
    }
    interact(entity) {
        if (this.keyHelper.getInteractPressed() && this.collide(entity) && entity instanceof Item) {
            this.inventory.push(this.newInventoryItem(entity.name));
            console.log('interacting');
            console.log(this.inventory);
        }
    }
    newInventoryItem(name) {
        return {
            id: this.inventory.length - 1,
            name: name
        };
    }
    setIsLanded(state) {
        this.isLanded = state;
    }
    kill() {
        this.switchView(new GameOverView());
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
    move() {
        if (this.activated)
            this.countdown -= 1;
        if (this.countdown == 0) {
            this.falling = true;
        }
        if (this.alive && this.falling) {
            this.offset.y = 0;
            this.velocity.y += this.gravity;
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
}
class Game {
    constructor(canvas) {
        this.loop = () => {
            if (this.currentView) {
                if (this.currentView.getShouldClear())
                    this.canvasHelper.clear();
                this.currentView.tick();
            }
        };
        this.switchView = (newView) => {
            if (this.currentView) {
                this.currentView.beforeExit();
            }
            this.currentView = newView;
        };
        this.canvasHelper = CanvasHelper.Instance(canvas);
        this.currentView = new TitleView(() => { this.switchView(new GameView("debug_level", this.switchView)); });
        this.currentInterval = setInterval(this.loop, 33);
    }
}
Game.DEBUG_MODE = true;
function init() {
    const game = new Game(document.getElementById("canvas"));
}
window.addEventListener('load', init);
var ItemId;
(function (ItemId) {
    ItemId[ItemId["NONE"] = 0] = "NONE";
    ItemId[ItemId["BANDAGE"] = 1] = "BANDAGE";
    ItemId[ItemId["IODINE"] = 2] = "IODINE";
    ItemId[ItemId["WATER"] = 3] = "WATER";
})(ItemId || (ItemId = {}));
class Accelerator extends Entity {
    constructor(imageSource = ["./assets/images/Anim_accelerator/1.png", "./assets/images/Anim_accelerator/2.png", "./assets/images/Anim_accelerator/3.png"], location, rotation, size, yeet) {
        super(imageSource, location, rotation, size, undefined, undefined, undefined, undefined);
        this.animationCounterMax = 10;
        this.yeet = yeet;
        this.collision = new CollisionObject(this.location.copy().sub(this.size.copy().multiply(.5)), this.location.copy().add(this.size.copy().multiply(.5)), this.rotation);
    }
    move() { }
    getRotation() {
        return this.rotation;
    }
    getYeet() {
        return this.yeet;
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
}
class Trampoline extends Entity {
    constructor(imageSource = ["./assets/images/trampoline.png"], location, rotation, size, gravity) {
        super(imageSource, location, rotation, size, gravity, undefined, undefined);
        this.collision = new CollisionObject(this.location.copy().sub(this.size.copy().multiply(.5)), this.location.copy().add(this.size.copy().multiply(.5)), this.rotation);
    }
    move() { }
}
var PlayingStat;
(function (PlayingStat) {
    PlayingStat[PlayingStat["PLAYING"] = 0] = "PLAYING";
    PlayingStat[PlayingStat["PAUSED"] = 1] = "PAUSED";
    PlayingStat[PlayingStat["STOPPED"] = 2] = "STOPPED";
})(PlayingStat || (PlayingStat = {}));
class SoundHelper {
    constructor(src) {
        this.audioElem = document.createElement("audio");
        this.audioElem.setAttribute("preload", "auto");
        this.audioElem.setAttribute("controls", "none");
        this.audioElem.style.display = "none";
        this.state = PlayingStat.PLAYING;
        this.audioElem.src = src;
        this.audioElem.play();
    }
    play() {
        this.audioElem.play();
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
class GameOverView extends BaseView {
    constructor() {
        super();
        this.shouldClear = false;
        for (let i = 0; i < 85; i++) {
            this.canvasHelper.fillRect(new Vector(0, this.canvasHelper.getCenter().y - 50 - i), new Vector(this.canvasHelper.getWidth(), this.canvasHelper.getCenter().y - 51 - i), `rgba(0, 0, 0, ${(85 - i) / 100})`);
            this.canvasHelper.fillRect(new Vector(0, this.canvasHelper.getCenter().y + 51 + i), new Vector(this.canvasHelper.getWidth(), this.canvasHelper.getCenter().y + 50 + i), `rgba(0, 0, 0, ${(85 - i) / 100})`);
        }
        this.canvasHelper.fillRect(new Vector(0, this.canvasHelper.getCenter().y - 50), new Vector(this.canvasHelper.getWidth(), this.canvasHelper.getCenter().y + 50), `rgba(0, 0, 0, ${85 / 100})`);
        this.canvasHelper.writeText("You died!", 96, this.canvasHelper.getCenter(), undefined, undefined, "red");
    }
    update() { }
    drawGUI() { }
    beforeExit() { }
}
//# sourceMappingURL=app.js.map
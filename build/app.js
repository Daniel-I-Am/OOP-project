class CanvasHelper {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
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
    drawImage(image, location, rotation, size) {
        this.ctx.save();
        this.ctx.translate(location.x, location.y);
        this.ctx.rotate(rotation.getValue());
        if (Math.min(...size.toArray()) < 0) {
            this.ctx.drawImage(image, -image.width / 2, -image.height / 2);
        }
        else {
            this.ctx.drawImage(image, -size.x / 2, -size.y / 2, size.x, size.y);
        }
        this.ctx.restore();
    }
    drawButton(image, caption, location, size, callback = null) {
        this.drawImage(image, location, new Rotation(0), size);
        this.writeText(caption, 24, location, "center", "middle", "black");
        if (!callback)
            return;
        let _listener = (event) => {
            let topleft = new Vector(this.canvas.offsetLeft + location.x - image.width / 2, this.canvas.offsetTop + location.y - image.height / 2), bottomRight = new Vector(this.canvas.offsetLeft + location.x + image.width / 2, this.canvas.offsetTop + location.y + image.height / 2);
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
    }
    getShouldClear() {
        return this.shouldClear;
    }
}
class Entity {
    constructor(imageSources, location, rotation, size, gravity, speed) {
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
        this.speed = speed;
    }
    collide(collideWith) {
        if (this.location.x + this.size.x / 2 + collideWith.getSize().x / 2 < collideWith.getLoc().x / 2 &&
            this.location.x - this.size.x / 2 - collideWith.getSize().x / 2 > collideWith.getLoc().x / 2 &&
            this.location.y + this.size.y / 2 + collideWith.getSize().y / 2 < collideWith.getLoc().y / 2 &&
            this.location.y - this.size.y / 2 - collideWith.getSize().y / 2 > collideWith.getLoc().y / 2)
            return true;
        return false;
    }
    update() {
        this.move();
        this.animationCounter++;
        this.animationCounter %= this.animationCounterMax;
        if (this.animationCounter == 0)
            this.activeImage = (this.activeImage + 1) % this.images.length;
        this.draw();
    }
    ;
    draw() {
        this.canvasHelper.drawImage(this.images[this.activeImage], this.location.copy().add(this.offset), this.rotation, this.size);
    }
    getSize() {
        return this.size;
    }
    getLoc() {
        return this.location;
    }
}
class Enemy extends Entity {
    constructor(canvas, imageSource, xPos, yPos, height, width, gravity, speed) {
        super([imageSource], new Vector(xPos, yPos), new Rotation(0), new Vector(width, height), gravity, speed);
    }
    moveRight() {
        this.location = this.location.add(new Vector(1, 0).multiply(this.speed));
    }
    moveLeft() {
        this.location = this.location.sub(new Vector(1, 0).multiply(this.speed));
    }
    move() {
    }
}
class FallingTile extends Entity {
    constructor(imageSource, location, rotation, size, gravity, speed) {
        super(imageSource, location, rotation, size, gravity, speed);
        this.countdown = 60;
        this.falling = false;
        this.location = new Vector(100, 100);
        console.log("YEET");
    }
    move() {
        this.countdown -= 1;
        if (this.countdown == 0) {
            this.falling = true;
        }
        if (this.location.y < 500 && this.falling) {
            this.offset.y = 0;
            this.speed += this.gravity;
            this.location.y += this.speed;
        }
        if (!this.falling) {
            this.offset.y = MathHelper.randomNumber(-5, 5, 2);
        }
    }
}
class Game {
    constructor(canvas) {
        this.loop = () => {
            if (this.currentView) {
                if (this.currentView.getShouldClear())
                    this.canvasHelper.clear();
                this.currentView.update();
            }
        };
        this.switchView = (newView) => {
            if (this.currentView) {
                this.currentView.beforeExit();
            }
            this.currentView = newView;
        };
        this.canvasHelper = CanvasHelper.Instance(canvas);
        this.currentView = new TitleView(() => { this.switchView(new GameView()); });
        this.currentInterval = setInterval(this.loop, 33);
    }
}
function init() {
    const game = new Game(document.getElementById("canvas"));
}
window.addEventListener('load', init);
var itemId;
(function (itemId) {
})(itemId || (itemId = {}));
class Item extends Entity {
    constructor(imageSource, xPos, yPos, height, width, gravity, speed) {
        super([imageSource], new Vector(xPos, yPos), new Rotation(0), new Vector(width, height), gravity, speed);
    }
    move() { }
}
class Player extends Entity {
    constructor(imageSources, location, size, gravity, speed) {
        super(imageSources, location, new Rotation(0), size, gravity, speed);
        this.keyHelper = new KeyHelper();
        this.animationCounterMax = 4;
    }
    move() {
        let x;
        if (this.keyHelper.getLeftPressed())
            x = this.location.x;
        x -= this.speed;
        this.location.x = x;
        if (this.keyHelper.getRightPressed())
            x = this.location.x;
        x += this.speed;
        this.location.x = x;
    }
    interact() {
        if (this.keyHelper.getInteractPressed())
            console.log('interacting');
    }
}
class GameView extends BaseView {
    constructor() {
        super();
        this.player = new Player([
            "./assets/player/anim_walk/PlayerAnim1.png",
            "./assets/player/anim_walk/PlayerAnim2.png",
            "./assets/player/anim_walk/PlayerAnim1.png",
            "./assets/player/anim_walk/PlayerAnim3.png",
        ], this.canvasHelper.getCenter(), new Vector(58.5, 150), 1, 5);
        this.tile = new FallingTile(["./assets/images/buttonGreen.png"], new Vector(100, 100), new Rotation(0), new Vector(-1, -1), 2, 0);
    }
    update() {
        this.tile.update();
        this.player.update();
        this.drawGUI();
    }
    drawGUI() {
        this.canvasHelper.writeText("Hello World!", 69, this.canvasHelper.getCenter(), undefined, undefined, "black");
    }
    beforeExit() { }
}
class TitleView extends BaseView {
    constructor(buttonCallback) {
        super();
        this.shouldClear = false;
        let buttonImage = new Image();
        buttonImage.addEventListener('load', () => {
            this.canvasHelper.drawButton(buttonImage, "Play!", this.canvasHelper.getCenter(), new Vector(buttonImage.width, buttonImage.height), buttonCallback);
        });
        buttonImage.src = "./assets/images/buttonGreen.png";
    }
    update() { }
    drawGUI() { }
    beforeExit() { }
}
//# sourceMappingURL=app.js.map
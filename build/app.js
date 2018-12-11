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
        this.ctx.fillText(text, location.getValue(0), location.getValue(1));
    }
    drawImage(image, location, rotation, size) {
        this.ctx.save();
        this.ctx.translate(location.getValue(0), location.getValue(1));
        this.ctx.rotate(rotation.getValue());
        this.ctx.drawImage(image, -size.getValue(0) / 2, -size.getValue(1) / 2, size.getValue(0), size.getValue(1));
        this.ctx.restore();
    }
    drawButton(image, caption, location, size, callback = null) {
        this.drawImage(image, location, new Rotation(0), size);
        this.writeText(caption, 24, location, "center", "middle", "black");
        if (!callback)
            return;
        let _listener = (event) => {
            let topleft = new Vector(this.canvas.offsetLeft + location.getValue(0) - image.width / 2, this.canvas.offsetTop + location.getValue(1) - image.height / 2), bottomRight = new Vector(this.canvas.offsetLeft + location.getValue(0) + image.width / 2, this.canvas.offsetTop + location.getValue(1) + image.height / 2);
            if (event.x < bottomRight.getValue(0) && event.x > topleft.getValue(0) && event.y < bottomRight.getValue(1) && event.y > topleft.getValue(1)) {
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
    getdownPressed() {
        return this.downPressed;
    }
}
class MathHelper {
    static randomNumber(min, max) {
        return Math.round(Math.random() * (max - min) + min);
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
    constructor(...args) {
        this.numbers = args;
    }
    toArray() {
        return this.numbers;
    }
    getValue(n) {
        return this.numbers[n];
    }
    updateValue(i, n) {
        this.numbers[i] = n;
    }
    getSize() {
        return Math.sqrt(this.numbers.map(e => Math.pow(e, 2)).reduce((a, b) => a + b, 0));
    }
    getDim() {
        return this.numbers.length;
    }
    add(vector) {
        if (this.getDim() != vector.getDim())
            throw new Error(`Dimension of vector does not match.\n${this.getDim()} != ${vector.getDim()}`);
        let myValue = this.toArray(), thatValue = vector.toArray();
        return new Vector(...myValue.map((e, i) => e + thatValue[i]));
    }
    sub(vector) {
        return this.add(vector.multiply(-1));
    }
    multiply(scalar) {
        return new Vector(...this.toArray().map(e => e * scalar));
    }
    normalize() {
        return this.multiply(1 / this.getSize());
    }
    max(n) {
        if (this.getSize() <= n)
            return this;
        return this.multiply(n / this.getSize());
    }
    min(n) {
        if (this.getSize() >= n)
            return this;
        return this.multiply(n / this.getSize());
    }
    rotate(radians) {
        if (this.getDim() != 2)
            throw new Error(`Rotate can only be called on a 2-dim vector\n${this.getDim()} != 2`);
        let myValue = this.toArray();
        let x = myValue[0], y = myValue[1];
        return new Vector(x * Math.cos(radians) - y * Math.sin(radians), x * Math.sin(radians) + y * Math.cos(radians));
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
    constructor(imageSource, location, rotation, size, gravity, speed) {
        this.canvasHelper = CanvasHelper.Instance();
        this.image = new Image();
        this.image.src = imageSource;
        this.location = location;
        this.rotation = rotation;
        this.size = size;
        this.gravity = gravity;
        this.speed = speed;
    }
    update() {
        this.move();
        this.draw();
    }
    ;
    draw() {
        this.canvasHelper.drawImage(this.image, this.location, this.rotation, this.size);
    }
}
class Enemy extends Entity {
    constructor(canvas, imageSource, xPos, yPos, height, width, speed, gravity) {
        super(imageSource, new Vector(xPos, yPos), new Rotation(0), new Vector(width, height), speed, gravity);
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
        this.currentView = new TitleView();
        this.currentInterval = setInterval(this.loop, 33);
    }
}
function init() {
    const game = new Game(document.getElementById("canvas"));
}
window.addEventListener('load', init);
class Item extends Entity {
    constructor(canvas, imageSource, xPos, yPos, height, width, speed) {
        super(imageSource, new Vector(xPos, yPos), new Rotation(0), new Vector(width, height), 0, speed);
    }
    move() { }
}
class Player extends Entity {
    constructor(canvas, imageSource, xPos, yPos, height, width, gravity, speed) {
        super(imageSource, new Vector(xPos, yPos), new Rotation(0), new Vector(width, height), gravity, speed);
        this.keyHelper = new KeyHelper();
    }
    move() {
        let x;
        if (this.keyHelper.getLeftPressed())
            x = this.location.getValue(0);
        x -= this.speed;
        this.location.updateValue(0, x);
        if (this.keyHelper.getRightPressed())
            x = this.location.getValue(0);
        x += this.speed;
        this.location.updateValue(0, x);
    }
}
class TitleView extends BaseView {
    constructor() {
        super();
        this.shouldClear = false;
        let buttonImage = new Image();
        buttonImage.addEventListener('load', () => {
            this.canvasHelper.drawButton(buttonImage, "Play!", this.canvasHelper.getCenter(), new Vector(buttonImage.width, buttonImage.height), (event) => { });
        });
        buttonImage.src = "./assets/images/buttonGreen.png";
    }
    update() { }
    drawGUI() { }
    beforeExit() { }
}
//# sourceMappingURL=app.js.map
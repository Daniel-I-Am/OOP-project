class MapPlayer extends Player {
    public constructor() {
        super(["./assets/player/mapPlayer.png"], CanvasHelper.Instance().getCenter(), new Vector(64, 64), 0, 0, 0, 0);
        this.maxSpeed = 3;
    }

    public move() {
        if (this.keyHelper.leftPressed) this.location.x -= this.maxSpeed;
        if (this.keyHelper.rightPressed) this.location.x += this.maxSpeed;
        if (this.keyHelper.upPressed) this.location.y -= this.maxSpeed;
        if (this.keyHelper.downPressed) this.location.y += this.maxSpeed;
    }
}
class MapPlayer extends Player {
    public constructor(location: Vector) {
        super(["./assets/player/mapPlayer.png"], location, new Vector(64, 64), 0, 0, 0, 0);
        this.maxSpeed = 3;
        this.canvasHelper.offset = new Vector(0, 0)
    }

    public move() {
        this.velocity = new Vector(0, 0);
        if (this.keyHelper.leftPressed) this.velocity.x = -this.maxSpeed;
        if (this.keyHelper.rightPressed) this.velocity.x = this.maxSpeed;
        if (this.keyHelper.upPressed) this.velocity.y = -this.maxSpeed;
        if (this.keyHelper.downPressed) this.velocity.y = this.maxSpeed;
        this.location.add(this.velocity);
        this.collision.updateLocation(this.location);
        Game.getCurrentView().entities.forEach(e => {
            if (e === this) return;
            if (e.collide(this)) {
                e.onPlayerCollision(this, null);
                this.location.sub(this.velocity);
                this.velocity = new Vector(0, 0);
            }
        });
    }
}
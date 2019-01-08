class Door extends Entity {
    public constructor(bottomRight: Vector, topLeft: Vector) {
        let size = bottomRight.copy().sub(topLeft.copy());
        size.x = Math.abs(size.x);
        size.y = Math.abs(size.y);
        super([], bottomRight.copy().add(topLeft.copy()).multiply(.5), new Rotation(0), size);
        this.shouldCollide = false;
        this.collision = new CollisionObject(topLeft.copy(), bottomRight.copy(), new Rotation(0));
    }

    public move() {}

    public onPlayerCollision(player: Player, collisionSides: CollisionDirections) {
        this.canvasHelper.writeText("Druk op e om het level te verlaten", 48, this.location.copy().add(new Vector(0, -200)).sub(this.canvasHelper.offset.copy()), undefined, undefined, "black")
    }
}
class Door extends Entity {
    public constructor(bottomRight: Vector, topLeft: Vector) {
        console.log(bottomRight.toString());
        console.log(topLeft.toString());
        let size = bottomRight.copy().sub(topLeft.copy());
        size.x = Math.abs(size.x);
        size.y = Math.abs(size.y);
        console.log(size.toString());
        super([], bottomRight.copy().add(topLeft.copy()).multiply(.5), new Rotation(0), size);
        console.log(this.location.toString());
        console.log(this.size.toString())
        console.log(bottomRight.toString());
        console.log(topLeft.toString());
        console.log(this);
    }

    public move() {}

    public onPlayerCollision(_: Player, collisionSides: CollisionDirections) {
        if (collisionSides.left || collisionSides.right || collisionSides.top || collisionSides.bottom)
            this.canvasHelper.writeText("Press e to interact", 44, this.canvasHelper.getCenter(),
            undefined, undefined, "black"); 
    }
}
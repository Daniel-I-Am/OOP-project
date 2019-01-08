class Door extends Entity {
    public constructor(bottomRight: Vector, topLeft: Vector) {
        let size = bottomRight.copy().sub(topLeft.copy());
        size.x = Math.abs(size.x);
        size.y = Math.abs(size.y);
        super(["./assets/images/default.png"], bottomRight.copy().add(topLeft.copy()).multiply(.5), new Rotation(0), size);
    }

    public move() {}

    public onPlayerCollision(player: Player, collisionSides: CollisionDirections) {
        if (collisionSides.left || collisionSides.right || collisionSides.top || collisionSides.bottom)
            console.log(collisionSides);
    }
}
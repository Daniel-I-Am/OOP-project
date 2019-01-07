class CollisionObject extends Entity {
    private collideFunction: (entity: Entity) => void

    public constructor(
        topLeft: Vector,
        bottomRight: Vector,
        rotation: Rotation,
        onCollide: (entity: Entity) => void = null
    ) {
        let textures = (Game.DEBUG_MODE ? ["./assets/images/default.png"] : [])
        super(
            textures,
            new Vector((topLeft.x + bottomRight.x)/2, (topLeft.y + bottomRight.y)/2,),
            rotation,
            new Vector(Math.abs(bottomRight.x-topLeft.x), Math.abs(bottomRight.y-topLeft.y)),
            undefined, undefined, undefined, undefined,
            new Rotation(0)
        );
        this.collideFunction = onCollide;
        this.collision = this;
    }

    public onCollide(entity: Entity): void {
        if (this.collideFunction)
            this.collideFunction(entity);
    }

    public updateLocation(location: Vector): void {
        this.location = location;
    }

    public collide(collideWith: CollisionObject): boolean {
        if (
            this.location.x - this.size.x/2 - collideWith.getSize().x/2 < collideWith.getLoc().x &&
            this.location.x + this.size.x/2 + collideWith.getSize().x/2 > collideWith.getLoc().x &&
            this.location.y - this.size.y/2 - collideWith.getSize().y/2 < collideWith.getLoc().y &&
            this.location.y + this.size.y/2 + collideWith.getSize().y/2 > collideWith.getLoc().y
        )
            return true;
        return false;
    }

    public move() {}

    public onPlayerCollision(player: Player, collisionSides: CollisionDirections): void {
        return; // don't think we need this to do anything, it's all handled in Player anyways
    }
}
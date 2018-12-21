class Trampoline extends Entity{

    public constructor(
        imageSource: Array<string> = ["./assets/images/trampoline.png"],
        location: Vector,
        rotation: Rotation,
        size: Vector,
        gravity: number,
    ) {
        super(imageSource, location, rotation, size, gravity, undefined, undefined);
        //this.animationCounterMax = 10;
        this.collision = new CollisionObject(
            this.location.copy().sub(this.size.copy().multiply(.5)),
            this.location.copy().add(this.size.copy().multiply(.5)),
            this.rotation
        )
    }

    protected move(): void {}

    public onPlayerCollision(player: Player): void {
        player.trampoline(this);
    }
}
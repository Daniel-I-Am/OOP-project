class Accelerator extends Entity{
    private yeet: number;

    public constructor(
        imageSource: Array<string> = ["./assets/images/Anim_accelerator/1.png","./assets/images/Anim_accelerator/2.png", "./assets/images/Anim_accelerator/3.png"],
        location: Vector,
        rotation: Rotation,
        size: Vector,
        yeet: number
    ) {
        super(imageSource, location, rotation, size, undefined, undefined, undefined, undefined);
        this.animationCounterMax = 10;
        this.yeet = yeet;
        this.collision = new CollisionObject(
            this.location.copy().sub(this.size.copy().multiply(.5)),
            this.location.copy().add(this.size.copy().multiply(.5)),
            this.rotation
        )
        this.shouldCollide = false;
    }

    protected move(): void {}

    public getYeet(): number {
        return this.yeet;
    }

    public onPlayerCollision(player: Player, collisionSides: CollisionDirections): void {
        if (this.collide(player))
            player.boost(this);
        
        let boostsound = new SoundHelper("./assets/sounds/accelerator.wav", .9)
        } 
}
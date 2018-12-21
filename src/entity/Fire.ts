class Fire extends Entity{

    public constructor(
        imageSources: Array<string> = ["./assets/images/fire.png"],
        location: Vector,
        rotation: Rotation,
        size: Vector,
        gravity: number,
    ) {
        super(imageSources, location, rotation, size, gravity, undefined, undefined);
        //this.animationCounterMax = 10;
        this.collision = new CollisionObject(
            this.location.copy().sub(this.size.copy().multiply(.5)),
            this.location.copy().add(this.size.copy().multiply(.5)),
            this.rotation
        )
        //this.shouldCollide = false;
    }

    protected move(): void {}

    public onPlayerCollision(player: Player): void {
        player.incFireCounter()

        if(player.getFireCounter() >= 150){
            player.kill();
        }
        console.log("FAYAA");
    }
}
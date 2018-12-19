class FallingTile extends Entity{
    private countdown: number = 120;
    private falling: boolean = false;
    private alive: boolean = true;
    public activated: boolean = false;
    

    public constructor(
        imageSource: Array<string> = ["./assets/images/fallingTile1.png"],
        location: Vector,
        rotation: Rotation,
        size: Vector,
        gravity: number,
        acceleration: number
    ) {
        super(imageSource, location, rotation, size, gravity, undefined, undefined, acceleration);
        this.collision = new CollisionObject(
            this.location.copy().sub(this.size.copy().multiply(.5)),
            this.location.copy().add(this.size.copy().multiply(.5)),
            this.rotation
        )
    }

    protected move(entites: Array<Entity>):void {
        if(this.activated) {
            this.countdown -= 1;
        }
        if(this.countdown == 0){
            this.falling = true;
        }
        if(this.alive && this.falling){ //replace with collide shit later on
            this.offset.y = 0;
            this.velocity.y += this.gravity;
            entites.forEach(e => {
                if (e.collide(this)) {
                    if (e == this) return;
                    this.alive = false;
                }
            });
            this.location.add(this.velocity);
        }
        if(!this.falling && this.activated) {
            this.offset.y = MathHelper.randomNumber(-2, 2, 2);
        }
    }
    public getFalling(){
        return this.falling;
    }
    public kill(){
        this.alive=false;
    }
    public getAlive(){
        return this.alive;
    }
}
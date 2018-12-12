class FallingTile extends Entity{
    private countdown: number = 60;
    private falling: boolean = false;

    public constructor(
        imageSource: Array<string> = ["./assets/images/fallingTile1.png"],
        location: Vector,
        rotation: Rotation,
        size: Vector,
        gravity: number,
        speed: number
    ) {
        super(imageSource, location, rotation, size, gravity, speed);
    }

    protected move():void{
        this.countdown -= 1
        if(this.countdown == 0){
            this.falling = true;
        }
        if(this.location.y < 500 && this.falling){ //replace with collide shit later on
            this.offset.y = 0;
            this.speed += this.gravity;
            this.location.y += this.speed;
        }
        if(!this.falling){
            this.offset.y = MathHelper.randomNumber(-2, 2, 2);
        }
    }
}
class FallingTile extends Entity{
    private countdown: number = 60;
    private falling: boolean = false;

    public constructor(
        imageSource: Array<string>,
        location: Vector,
        rotation: Rotation,
        size: Vector,
        gravity: number,
        speed: number
    ) {
        super(imageSource, location, rotation, size, gravity, speed);
        this.location = new Vector(100,100);
        console.log("YEET");

    }






    protected move():void{
        this.countdown -= 1
        if(this.countdown == 0){
            this.falling = true;
        }
        if(this.location.getValue(1) < 500 && this.falling){ //replace with collide shit later on
            this.speed += this.gravity;
            this.location.updateValue(1,this.location.getValue(1)+this.speed);
        }
        if(!this.falling){
            this.location.updateValue(1,this.location.getValue(1)+MathHelper.randomNumber(-2,2));
        }
    }
}
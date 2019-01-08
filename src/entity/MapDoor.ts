class MapDoor extends Entity {
    private levelName: string;
    private internalName: string;

    public constructor(location: Vector, levelName: string, internalName: string, rotation: Rotation, imageSrc: string = 'Door.png') {
        super([`./assets/images/${imageSrc}`], location, rotation, new Vector(64, 64));
        this.levelName = levelName;
        this.internalName = internalName;
        this.collision = new CollisionObject(
            this.location.copy().add(this.size.copy().multiply(.5)),
            this.location.copy().sub(this.size.copy().multiply(.5)),
            this.rotation
        );
    }
    public move() {}
    
    public onPlayerCollision() {
        Game.switchView(new DialogueView(this.internalName));
    }

    public drawName(): void {
        this.canvasHelper.writeText(this.levelName, 24, this.location.copy().sub(new Vector(0, 50)), undefined, undefined, "green");
    }
}
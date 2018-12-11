abstract class Entity {
    protected image: HTMLImageElement;
    protected location: Vector;
    protected rotation: Rotation;
    protected size: Vector;
    protected speed: number;
    private canvasHelper: CanvasHelper;

    protected constructor(
        imageSource: string,
        location: Vector,
        rotation: Rotation,
        size: Vector,
        movementSpeed: number,
    ) {
        this.canvasHelper = CanvasHelper.Instance();
        this.image = new Image();
        this.image.src = imageSource;
        this.location = location;
        this.rotation = rotation;
        this.size = size;
        this.speed = movementSpeed;
    }

    protected draw() {
        this.canvasHelper.drawImage(this.image, this.location, this.rotation, this.size);
    }
}
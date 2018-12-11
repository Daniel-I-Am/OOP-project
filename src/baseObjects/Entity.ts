abstract class Entity {
    protected image: HTMLImageElement;
    protected location: Vector;
    protected rotation: Rotation;
    protected size: Vector;
    protected speed: number;
    protected gravity: number;
    private canvasHelper: CanvasHelper;

    protected constructor(
        imageSource: string,
        location: Vector,
        rotation: Rotation,
        size: Vector,
        gravity: number,
        speed: number,
    ) {
        this.canvasHelper = CanvasHelper.Instance();
        this.image = new Image();
        this.image.src = imageSource;
        this.location = location;
        this.rotation = rotation;
        this.size = size;
        this.gravity = gravity;
        this.speed = speed;
    }

    public update(): void {
        this.move();
        this.draw();
    };

    private draw() {
        this.canvasHelper.drawImage(this.image, this.location, this.rotation, this.size);
    }

    protected abstract move(): void;

}
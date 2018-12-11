abstract class Entity {
    protected images: Array<HTMLImageElement>;
    private animationCounter: number;
    protected animationCounterMax: number;
    protected activeImage: number;
    protected location: Vector;
    protected rotation: Rotation;
    protected size: Vector;
    protected speed: number;
    protected gravity: number;
    private canvasHelper: CanvasHelper;

    protected constructor(
        imageSources: Array<string>,
        location: Vector,
        rotation: Rotation,
        size: Vector,
        gravity: number,
        speed: number,
    ) {
        this.canvasHelper = CanvasHelper.Instance();
        this.images = new Array<HTMLImageElement>();
        this.activeImage = 0;
        this.animationCounter = 0;
        this.animationCounterMax = 1;
        imageSources.forEach(e => {
            let image = new Image();
            image.src = e;
            this.images.push(image);
        });
        this.location = location;
        this.rotation = rotation;
        this.size = size;
        if (Math.min(...this.size.toArray()) < 0)
            this.images[0].addEventListener('load', () => {
                this.size = new Vector(
                    this.images[0].width, this.images[0].height
                );
            });
        this.gravity = gravity;
        this.speed = speed;
    }

    public update(): void {
        this.move();
        this.animationCounter++;
        this.animationCounter %= this.animationCounterMax;
        if (this.animationCounter == 0)
            this.activeImage = (this.activeImage+1) % this.images.length;
        this.draw();
    };

    private draw() {
        this.canvasHelper.drawImage(this.images[this.activeImage], this.location, this.rotation, this.size);
    }

    protected abstract move(): void;

}

abstract class Entity {
    protected images: Array<HTMLImageElement>;
    private animationCounter: number;
    protected animationCounterMax: number;
    protected activeImage: number;
    protected location: Vector;
    protected offset: Vector;
    protected rotation: Rotation;
    protected size: Vector;
    protected speed: number;
    protected direction: Rotation;
    protected gravity: number;
    private canvasHelper: CanvasHelper;

    protected constructor(
        imageSources: Array<string>,
        location: Vector,
        rotation: Rotation,
        size: Vector,
        gravity: number = 0,
        speed: number = 0,
        direction: Rotation = new Rotation(0),
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
        this.offset = new Vector(0, 0);
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
        this.direction = direction;
    }

    public collide(
        collideWith: Entity
    ): boolean {
        if (
            this.location.x + this.size.x/2 + collideWith.getSize().x/2 < collideWith.getLoc().x/2 &&
            this.location.x - this.size.x/2 - collideWith.getSize().x/2 > collideWith.getLoc().x/2 &&
            this.location.y + this.size.y/2 + collideWith.getSize().y/2 < collideWith.getLoc().y/2 &&
            this.location.y - this.size.y/2 - collideWith.getSize().y/2 > collideWith.getLoc().y/2
        )
            return true;
        return false;
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
        this.canvasHelper.drawImage(this.images[this.activeImage], this.location.copy().add(this.offset), this.rotation, this.size);
    }

    protected abstract move(): void;

    // Getters & Setters
    public getSize(): Vector {
        return this.size;
    }

    public getLoc(): Vector {
        return this.location;
    }
}

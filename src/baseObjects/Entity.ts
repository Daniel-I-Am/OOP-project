abstract class Entity {
    protected images: Array<HTMLImageElement>;
    private animationCounter: number;
    protected animationCounterMax: number;
    protected activeImage: number;
    protected location: Vector;
    protected offset: Vector;
    protected rotation: Rotation;
    protected size: Vector;
    protected velocity: Vector;
    protected maxSpeed: number;
    protected acceleration: number;
    protected direction: Rotation;
    protected gravity: number;
    protected canvasHelper: CanvasHelper;
    protected collision: CollisionObject;
    public shouldCollide: boolean = true;
    protected drawOnDeath: boolean = true;
    protected isAlive: boolean = true;

    protected constructor(
        imageSources: Array<string> = ["./assets/images/default.png"],
        location: Vector,
        rotation: Rotation,
        size: Vector,
        gravity: number = 0,
        velocity: Vector = new Vector(0, 0),
        acceleration: number = 0,
        maxSpeed: number = 0,
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
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.maxSpeed = maxSpeed;
        this.direction = direction;
        this.collision = null;
    }

    public collide(
        collideWith: Entity
    ): boolean {
        if (this.collision == null || collideWith.getCollision() == null) return false;
        return this.collision.collide(collideWith.getCollision());
    }

    public getCollision(): CollisionObject {
        return this.collision;
    }

    public removeCollision() {
        this.collision = null;
    }

    public abstract onPlayerCollision(player: Player, collisionSides: CollisionDirections): void;

    public update(entities: Array<Entity> = null): void {
        this.move(entities);
        if (this.getCollision()) {
            if (!(this instanceof CollisionObject)) {
                this.getCollision().updateLocation(this.location);
            }
            this.getCollision().draw();
        }
        this.animationCounter++;
        this.animationCounter %= this.animationCounterMax;
        if (this.animationCounter == 0)
            this.activeImage = (this.activeImage+1) % this.images.length;
        if (this.drawOnDeath || this.isAlive) {
            this.draw();
            if (this instanceof Player)
                this.drawOverlay();
        }
    };

    public draw(): void {
        if (this.images.length <= 0) return;
        this.canvasHelper.drawImage(this.images[this.activeImage], this.location.copy().add(this.offset), this.rotation, this.size);
    }

    /**
     * Called once per update, needs to handle movement and collision
     * @param entites List of entities to collide with
     */
    protected abstract move(entites: Array<Entity>): void;

    // Getters & Setters
    public getSize(): Vector {
        return this.size;
    }

    public getLoc(): Vector {
        return this.location;
    }

    public getVelocity(): Vector {
        return this.velocity;
    }

    public getRot(): Rotation {
        return this.rotation;
    }

    public getAlive(): boolean {
        return this.isAlive;
    }

    public kill(): void {
        this.isAlive = false;
    }

    public revive(): void {
        this.isAlive = true;
    }
}

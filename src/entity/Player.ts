class Player extends Entity {
    private keyHelper: KeyHelper;
    private inventory: Array<InventoryItem>;
    private jumpHeight: number;
    private isJumping: boolean;
    private isLanded: boolean;
    private jumpSpeed: number;
    private switchView: (newView: BaseView) => void;

    /**
     * @constructor
     * @param {Array<string>} imageSources
     * @param {Vector} location
     * @param {number} height
     * @param {number} width
     * @param {number} gravity
     * @param {number} acceleration
     */
    public constructor(
        imageSources: Array<string>,
        location: Vector,
        size: Vector,
        gravity: number,
        acceleration: number,
        switchView: (newView: BaseView) => void,
    ) {
        super(
            imageSources,
            location,
            new Rotation(0),
            size,
            gravity,
            undefined,
            acceleration,
            15
        );

        this.keyHelper = new KeyHelper();
        this.animationCounterMax = 4;
        this.isJumping = false;
        this.isLanded = false;
        this.inventory = new Array<InventoryItem>();
        this.jumpSpeed = 30;

        this.collision = new CollisionObject(
            this.location.copy().sub(this.size.copy().multiply(.5)),
            this.location.copy().add(this.size.copy().multiply(.5)).sub(new Vector(0, 20)),
            this.rotation
        )
        this.canvasHelper.offset.x -= this.canvasHelper.offset.x + this.canvasHelper.getWidth()/2 - this.location.x;
        this.canvasHelper.offset.y -= this.canvasHelper.offset.y + this.canvasHelper.getHeight()/2 - this.location.y
    }


    /**
     * Function to move the player
     */
    public move(): void {
        // if we can move faster, do so
        if (this.keyHelper.getLeftPressed() && this.velocity.x > -this.maxSpeed) {
            this.velocity.x -= this.acceleration;
        }
        if (this.keyHelper.getRightPressed() && this.velocity.x < this.maxSpeed) {
            this.velocity.x += this.acceleration;
        }
        // if we can jump, do so
        if (this.keyHelper.getSpaceBarPressed() && this.isLanded) {
            this.velocity.y -= this.jumpSpeed;
        }
        // *Booooo* gravity
        this.velocity.y += this.gravity;
        // if we're landed, don't phase through the floor and use friction
        if (this.isLanded) {
            this.velocity.y = Math.min(this.velocity.y, 0)
            if (!(
                this.keyHelper.getLeftPressed() ||
                this.keyHelper.getRightPressed()
            )) {
                this.velocity.x *= .60;
            }
        }
        // update our location
        this.location.add(this.velocity)

        // move the camera
        var dx = this.canvasHelper.offset.x + this.canvasHelper.getWidth()/2 - this.location.x
        var dy = this.canvasHelper.offset.y + this.canvasHelper.getHeight()/2 - this.location.y
        this.canvasHelper.offset.x -= 1*10**-17*dx**7
        this.canvasHelper.offset.y -= 1*10**-17*dy**7
    }


    public footCollision(
        collideWith: Entity
    ): boolean {
        let other = collideWith.getCollision()
        if (other == null) return false;
        if (
            this.location.x - 1 - other.getSize().x/2 < other.getLoc().x &&
            this.location.x + 1 + other.getSize().x/2 > other.getLoc().x &&
            // Where did this number come     \/ from?      MAGIC!
            this.location.y + this.size.y/2 - 20 - other.getSize().y/2 < other.getLoc().y &&
            this.location.y + this.size.y/2 - 20 + other.getSize().y/2 > other.getLoc().y
        )
            return true;
        return false;
    }

    public boost(booster: Accelerator) {
        this.velocity = new Vector(booster.getYeet(), 0).rotate(booster.getRotation().getValue());
    }

    public trampoline() {
        this.velocity = new Vector(this.velocity.x,-this.velocity.y-5);
    }

    /**
     * Function to interact
     */
    public interact(entity: Entity): void {
        if (this.keyHelper.getInteractPressed() && this.collide(entity) && entity instanceof Item) {
            this.inventory.push(this.newInventoryItem(entity.name))
            console.log('interacting');
            console.log(this.inventory)
        }
    }

    private newInventoryItem(name: string): InventoryItem {
        return {
            id: this.inventory.length - 1,
            name: name
        }
    }

    public setIsLanded(state: boolean): void    {
        this.isLanded = state;
    }
}

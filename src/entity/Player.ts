class Player extends Entity {
    private keyHelper: KeyHelper;
    private inventory: Array<InventoryItem>;
    private jumpHeight: number;
    private isJumping: boolean;
    private isLanded: boolean;
    public tempMaxSpeed: number;
    private jumpSpeed: number = 100;

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
        acceleration: number
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
        this.tempMaxSpeed = this.maxSpeed;
        this.jumpSpeed = 100;
    }


    /**
     * Function to move the player
     */
    public move(): void {
        if (this.keyHelper.getLeftPressed()) {
            this.velocity.x -= this.acceleration;
        }
        if (this.keyHelper.getRightPressed()) {
            this.velocity.x += this.acceleration;
        }
        if (this.keyHelper.getSpaceBarPressed()) {
            if (this.isLanded) {
                this.velocity.y -= this.jumpSpeed = 100;;
            }
        }
        this.velocity.y += this.gravity;
        this.velocity.x = new Vector(this.velocity.x, 0).max(this.tempMaxSpeed).x
        this.velocity.y = new Vector(0, this.velocity.y).max(this.tempMaxSpeed).y
        if (this.isLanded) {
            this.velocity.y = Math.min(this.velocity.y, 0)
            if (!(
                this.keyHelper.getLeftPressed() ||
                this.keyHelper.getRightPressed()
            )) {
                this.velocity.x *= .60;
            }
        }
        this.location.add(this.velocity)
        if(this.tempMaxSpeed>this.maxSpeed) this.tempMaxSpeed -= 0.5;
        this.tempMaxSpeed = Math.min(this.tempMaxSpeed, Math.max(Math.abs(this.velocity.x), Math.abs(this.velocity.y)));
        this.tempMaxSpeed = Math.max(this.tempMaxSpeed, this.maxSpeed);
        var dx = this.canvasHelper.offset + this.canvasHelper.getWidth()/2 - this.location.x
        this.canvasHelper.offset -= 2*10**-19*dx**7
    }


    public footCollision(
        collideWith: Entity
    ): boolean {
        if (
            this.location.x - 1 - collideWith.getSize().x/2 < collideWith.getLoc().x &&
            this.location.x + 1 + collideWith.getSize().x/2 > collideWith.getLoc().x &&
            // Where did this number come     \/ from?      MAGIC!
            this.location.y + this.size.y/2 - 30 - collideWith.getSize().y/2 < collideWith.getLoc().y &&
            this.location.y + this.size.y/2 - 30 + collideWith.getSize().y/2 > collideWith.getLoc().y
        )
            return true;
        return false;
    }

    public boost(booster: Accelerator) {
        this.velocity = new Vector(100, 0).rotate(booster.getRotation().getValue());
        this.tempMaxSpeed = 100;
    }
    public trampoline(){
        this.velocity = new Vector(this.velocity.x,-this.velocity.y-5);
        this.tempMaxSpeed = 100;
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

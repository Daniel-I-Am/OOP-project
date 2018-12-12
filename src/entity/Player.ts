class Player extends Entity {
    private keyHelper: KeyHelper;
    private inventory: Inventory;
    private jumpHeight: number;
    private isJumping: boolean;
    private isLanded: boolean;

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
            if (!this.isJumping) {
                this.velocity.y -= this.acceleration;
            }
        }
        this.velocity.y += this.gravity;
        this.velocity.x = new Vector(this.velocity.x, 0).max(this.maxSpeed).x
        this.velocity.y = new Vector(0, this.velocity.y).max(this.maxSpeed).y
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
    }


    public footCollision(
        collideWith: Entity
    ): boolean {
        if (
            this.location.x - this.size.x/2 - collideWith.getSize().x/2 < collideWith.getLoc().x &&
            this.location.x + this.size.x/2 + collideWith.getSize().x/2 > collideWith.getLoc().x &&
            this.location.y + this.size.y/2 - collideWith.getSize().y/2 < collideWith.getLoc().y &&
            this.location.y + this.size.y/2 + collideWith.getSize().y/2 > collideWith.getLoc().y
        )
            return true;
        return false;
    }

    /**
     * Function to interact
     */
    public interact(): void {
        if (this.keyHelper.getInteractPressed())
            console.log('interacting');
    }

    public setIsLanded(state: boolean): void {
        this.isLanded = state;
    }
}

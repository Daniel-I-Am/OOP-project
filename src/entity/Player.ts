class Player extends Entity {
    private keyHelper: KeyHelper;
    private inventory: Inventory;
    private jumpHeight: number;
    private isJumping: boolean;

    /**
     * @constructor
     * @param {Array<string>} imageSources
     * @param {Vector} location
     * @param {number} height
     * @param {number} width
     * @param {number} gravity
     * @param {number} speed
     */
    public constructor(
        imageSources: Array<string>,
        location: Vector,
        size: Vector,
        gravity: number,
        speed: number
    ) {
        super(
            imageSources,
            location,
            new Rotation(0),
            size,
            gravity,
            speed
        );

        this.keyHelper = new KeyHelper();
        this.animationCounterMax = 4;
        this.isJumping = false;
        this.jumpHeight = 50;
    }


    /**
     * Function to move the player
     */
    public move(): void {
        if (this.keyHelper.getLeftPressed()) {
            this.location.x -= this.speed;
        }
        if (this.keyHelper.getRightPressed()) {
            this.location.x += this.speed;
        }
        if (this.keyHelper.getSpaceBarPressed()) {
            if (!this.isJumping) {
                this.isJumping = true;
                this.location.y -= this.jumpHeight;
                setTimeout(() => {
                    this.location.y += this.jumpHeight;
                    setTimeout(() => {
                        this.isJumping = false;
                    }, 350);
                }, 300);
            }
        }
    }


    /**
     * Function to interact
     */
    public interact(): void {
        if (this.keyHelper.getInteractPressed())
            console.log('interacting');
    }
}

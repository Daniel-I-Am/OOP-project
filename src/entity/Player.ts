class Player extends Entity {
    private keyHelper: KeyHelper;
    private inventory: Inventory;

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
    }


    /**
     * Function to move the player
     */
    public move(): void {
        if (this.keyHelper.getLeftPressed())
            this.location.x -= this.speed;
        if (this.keyHelper.getRightPressed())
            this.location.x += this.speed;
    }


    /**
     * Function to interact
     */
    public interact() {
        if (this.keyHelper.getInteractPressed())
            console.log('interacting');
    }
}

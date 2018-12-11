class Player extends Entity {
    private keyHelper: KeyHelper;
    private inventory: Inventory;

    /**
     * @constructor
     * @param {string} imageSource
     * @param {number} xPos
     * @param {number} yPos
     * @param {number} height
     * @param {number} width
     * @param {number} speed
     */
    constructor(
        imageSource: string,
        xPos: number,
        yPos: number,
        height: number,
        width: number,
        gravity: number,
        speed: number
    ) {
        super(
            imageSource,
            new Vector(xPos, yPos),
            new Rotation(0),
            new Vector(width, height),
            gravity,
            speed
        );

        this.keyHelper = new KeyHelper();
    }


    /**
     * Function to move the player right
     */
    public move(): void {
        let x: number;
        if (this.keyHelper.getLeftPressed())
            x = this.location.getValue(0);
            x -= this.speed;
            this.location.updateValue(0, x);
        if (this.keyHelper.getRightPressed())
            x = this.location.getValue(0);
            x += this.speed;
            this.location.updateValue(0, x);
    }


    /**
     * Function to interact
     */
    public interact() {
        if (this.keyHelper.getInteractPressed())
            console.log('interacting');
    }
}

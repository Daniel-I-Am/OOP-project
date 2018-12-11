class Player extends Entity {
    private keyHelper: KeyHelper;

    /**
     * @constructor
     * @param {Array<string>} imageSources
     * @param {Vector} location
     * @param {number} height
     * @param {number} width
     * @param {number} speed
     */
    constructor(
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
}

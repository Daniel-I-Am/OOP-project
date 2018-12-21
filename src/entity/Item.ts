class Item extends Entity {
    private id: ItemDefinition;

    private static itemIDs: Array<ItemDefinition> = [
        {internalName: "none", displayName: "None", spriteSrc: null},
        {internalName: "bandage", displayName: "Bandage", spriteSrc: "./assets/images/bandage.png"},
        {internalName: "", displayName: "", spriteSrc: ""},
    ]

    /**
     * @constructor
     * @param {string} imageSource
     * @param {number} xPos
     * @param {number} yPos
     * @param {number} height
     * @param {number} width
     * @param {number} gravity
     * @param {number} acceleration
     */
    public constructor(
        imageSource: string,
        location: Vector,
        rotation: Rotation,
        size: Vector,
        name: string
    ) {
        super(
            [imageSource],
            location,
            rotation,
            size
        );
        this.id = (Item.itemIDs.map((e) => {
            if (e.internalName == name)
                return e;
            return null;
        })).filter(e => {
            return e;
        })[0] || Item.itemIDs[0];
        this.collision = new CollisionObject(
            this.location.copy().sub(this.size.copy().multiply(.5)),
            this.location.copy().add(this.size.copy().multiply(.5)),
            this.rotation
        )
    }

    public move(): void {
        const d = new Date();
        this.offset.y = 5 * Math.sin((1000 * d.getSeconds() + d.getMilliseconds()) * 0.0008 * Math.PI);
    }
}

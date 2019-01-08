class Item extends Entity {
    private itemData: ItemDefinition;
    private itemID: number;

    public static readonly itemIDs: Array<ItemDefinition> = [
        {internalName: "none", displayName: "None", spriteSrc: null},
        {internalName: "bandage", displayName: "Een pleister", spriteSrc: "./assets/images/items/bandage.png"},
        {internalName: "citroen", displayName: "Een citroen", spriteSrc: "./assets/images/items/citroen.png"},
        {internalName: "jodium", displayName: "Jodium", spriteSrc: "./assets/images/items/jodium.png"},
        {internalName: "keukenrol", displayName: "Keukenrol", spriteSrc: "./assets/images/items/keukenrol.png"},
        {internalName: "water", displayName: "Water", spriteSrc: "./assets/images/items/water.png"}
    ]

    /**
     * @constructor
     * @param {number} xPos
     * @param {number} yPos
     * @param {number} height
     * @param {number} width
     * @param {number} gravity
     * @param {number} acceleration
     */
    public constructor(
        location: Vector,
        rotation: Rotation,
        size: Vector,
        name: string,
        gravity: number = 0,
    ) {
        let itemData = (Item.itemIDs.map((e) => {
            if (e.internalName == name)
                return e;
            return null;
        })).filter(e => {
            return e;
        })[0] || Item.itemIDs[0];
        super(
            [itemData.spriteSrc],
            location,
            rotation,
            size,
            gravity
        );
        this.drawOnDeath = false;
        this.shouldCollide = false;
        this.itemData = itemData;
        this.itemID = Item.itemIDs.map((e, i) => {
            if (e === itemData)
                return i
            return 0
        }).reduce((s, e) => {return s+e});
        this.collision = new CollisionObject(
            this.location.copy().sub(this.size.copy().multiply(.5)),
            this.location.copy().add(this.size.copy().multiply(.5)),
            this.rotation
        )
    }

    public move(): void {
        const d = new Date();
        this.offset.y = 5 * Math.sin((1000 * d.getSeconds() + d.getMilliseconds()) * 0.0008 * Math.PI);
        this.velocity.y += this.gravity;
        Game.getCurrentView().entities.forEach(e => {
            if (e === this) return;
            if (e.collide(this))
                this.velocity.y = 0;
        });
        this.location.add(this.velocity);
    }

    public getItemID(): number {
        return this.itemID;
    }

    public onPlayerCollision(player: Player, collisionSides: CollisionDirections): void {
        return;
    }

    public removeHitBox(): void {
        this.collision = null;
    }
}

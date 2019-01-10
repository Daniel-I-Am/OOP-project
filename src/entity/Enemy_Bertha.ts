class Enemy_Bertha extends Entity {
    private walkSpeed: number = 3;
    private landed: boolean = false;
    
    /**
     * @constructor
     * @param {HTMLCanvasElement} canvas
     * @param {string} imageSource
     * @param {number} xPos
     * @param {number} yPos
     * @param {number} height
     * @param {number} width
     * @param {number} gravity
     * @param {number} acceleration
     */
    public constructor(
        imageSources: Array<string> = [
            "./assets/bertha/anim_walk/1.png",
            "./assets/bertha/anim_walk/2.png",
            "./assets/bertha/anim_walk/1.png",
            "./assets/bertha/anim_walk/3.png"
        ],
        location: Vector,
        size: Vector,
        gravity: number
    ) {
        super(
            imageSources,
            location,
            new Rotation(0),
            size,
            gravity,
            undefined,
            2
        );
        this.collision = new CollisionObject(
            this.location.copy().sub(this.size.copy().multiply(.5)),
            this.location.copy().add(this.size.copy().multiply(.5)),
            this.rotation
        )
        this.velocity.x = this.walkSpeed;
        this.animationCounterMax = 4;
    }

    protected move(entities: Array<Entity>): void {
        this.landed = false;
        
        entities.forEach(e => {
            if(this.collide(e) && e !== this) {
                this.landed = true;
            }
        })
        if(!this.landed) {
            this.velocity.x *=-1;
        } else {
            this.velocity.y = 0;
        }
        this.location.add(this.velocity)
        entities.forEach(e => {
            if(this.collide(e) && e !== this) {
                this.landed = true;
            }
        })
        if(!this.landed) {
            this.velocity.y += this.gravity;
        }
    }

    public onPlayerCollision(player: Player, collisionSides: CollisionDirections): void {
        if (collisionSides.left || collisionSides.right || collisionSides.top || collisionSides.bottom)
            player.kill();
    }
}

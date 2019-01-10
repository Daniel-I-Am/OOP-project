class Enemy_Bertha extends Entity {
    private walkSpeed: number = 3;
    private landed: boolean = false;
    private leftCollision: CollisionObject;
    private rightCollision: CollisionObject;
    private bottomLeftCollision: CollisionObject;
    private bottomRightCollision: CollisionObject;
    
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
        );
        this.leftCollision = new CollisionObject(
            this.location.copy().sub(new Vector(this.size.x/2+2, (this.size.y/2-10))),
            this.location.copy().sub(new Vector(this.size.x/2, -(this.size.y/2-10))),
            this.rotation
        );
        this.rightCollision = new CollisionObject(
            this.location.copy().add(new Vector(this.size.x/2+2, (this.size.y/2-10))),
            this.location.copy().add(new Vector(this.size.x/2, -(this.size.y/2-10))),
            this.rotation
        );
        this.velocity.x = this.walkSpeed;
        this.animationCounterMax = 4;
    }

    protected move(entities: Array<Entity>): void {
        this.landed = false;
        
        entities.forEach(e => {
            if (e === this) return;
            if (this.collide(e)) {
                this.landed = true;
            }
            if (e instanceof Player) return;
            if (e instanceof Enemy_Bertha) return;
            if (e.collide(this.leftCollision)) {
                this.velocity.x = Math.abs(this.velocity.x);
            }
            if (e.collide(this.rightCollision)) {
                this.velocity.x = -Math.abs(this.velocity.x);
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

        this.leftCollision.updateLocation(this.location.copy().sub(new Vector(this.size.x/2+1, 0)));
        this.rightCollision.updateLocation(this.location.copy().add(new Vector(this.size.x/2+1, 0)));
        this.leftCollision.draw();
        this.rightCollision.draw();
    }

    public onPlayerCollision(player: Player, collisionSides: CollisionDirections): void {
        if (collisionSides.left || collisionSides.right || collisionSides.top || collisionSides.bottom)
            player.kill();
    }
}

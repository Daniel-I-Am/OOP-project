class Player extends Entity {
    private keyHelper: KeyHelper;
    private inventory: Array<InventoryItem>;
    private isJumping: boolean;
    private isLanded: boolean;
    private jumpSpeed: number;
    private maxJumps: number;
    private jumpCount: number;
    private isAlive: boolean;
    private switchView: (newView: BaseView) => void;

    private leftCollision: CollisionObject;
    private rightCollision: CollisionObject;
    private topCollision: CollisionObject;
    private bottomCollision: CollisionObject;
    private previousCollision: CollisionDirections;

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
        acceleration: number,
        jumpHeight: number,
        maxJumps: number,
        switchView: (newView: BaseView) => void,
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
        this.maxJumps = maxJumps;
        this.jumpCount = 0;
        this.jumpSpeed = jumpHeight;
        this.isAlive = true;
        this.switchView = switchView;
        
        this.collision = new CollisionObject(
            this.location.copy().sub(this.size.copy().multiply(.5).add(new Vector(5, 5))),
            this.location.copy().add(this.size.copy().multiply(.5)).sub(new Vector(5, 5)),
            this.rotation
        )
        this.canvasHelper.offset.x -= this.canvasHelper.offset.x + this.canvasHelper.getWidth()/2 - this.location.x;
        this.canvasHelper.offset.y -= this.canvasHelper.offset.y + this.canvasHelper.getHeight()/2 - this.location.y

        this.leftCollision = new CollisionObject(
            this.location.copy().add(new Vector(-this.size.x/2, -this.size.y/2+1)),
            this.location.copy().add(new Vector(-this.size.x/2, this.size.y/2-40)),
            this.rotation,
        );
        this.rightCollision = new CollisionObject(
            this.location.copy().add(new Vector(this.size.x/2, -this.size.y/2+1)),
            this.location.copy().add(new Vector(this.size.x/2, this.size.y/2-40)),
            this.rotation,
        );
        this.bottomCollision = new CollisionObject(
            this.location.copy().add(new Vector(-this.size.x/2+1, this.size.y/2)),
            this.location.copy().add(new Vector(this.size.x/2-1, this.size.y/2)),
            this.rotation,
        );
        this.topCollision = new CollisionObject(
            this.location.copy().add(new Vector(-this.size.x/2+1, -this.size.x/2)),
            this.location.copy().add(new Vector(this.size.x/2-1, -this.size.x/2)),
            this.rotation,
        );
        this.previousCollision = {left: false, right: false, top: false, bottom: false};
    }


    /**
     * Function to move the player
     */
    public move(entites: Array<Entity>): void {
        let collision = this.playerCollision(entites);
        // if we can move faster, do so
        if (this.keyHelper.getLeftPressed() && this.velocity.x > -this.maxSpeed) {
            this.velocity.x -= this.acceleration;
        }
        if (this.keyHelper.getRightPressed() && this.velocity.x < this.maxSpeed) {
            this.velocity.x += this.acceleration;
        }
        // if we can jump, do so
        if (this.isLanded) this.jumpCount = 0;
        if (this.keyHelper.getSpaceBarPressed() && this.jumpCount < this.maxJumps) this.jump();
        // *Booooo* gravity
        this.velocity.y += this.gravity;
        // if we're landed, don't phase through the floor and use friction
        if (this.isLanded) {
            this.velocity.y = Math.min(this.velocity.y, 0)
            if (!(
                this.keyHelper.getLeftPressed() ||
                this.keyHelper.getRightPressed()
            )) {
                this.velocity.x *= .60;
            }
        }
        // update our location
        if (collision.left) {
            if (!this.previousCollision.left)
                this.velocity.x = Math.max(this.velocity.x, this.velocity.x/2);
            else
                this.velocity.x = Math.max(this.velocity.x, 0);
        }
        if (collision.right) {
            if (!this.previousCollision.right)
                this.velocity.x = Math.min(this.velocity.x, this.velocity.x/2);
            else
                this.velocity.x = Math.min(this.velocity.x, 0);
        }
        if (collision.top) {
            if (!this.previousCollision.top)
                this.velocity.y = Math.max(this.velocity.y, this.velocity.y/2);
            else
                this.velocity.y = Math.max(this.velocity.y, 0);
        }
        if (collision.bottom) {
            if (!this.previousCollision.bottom)
                this.velocity.y = Math.min(this.velocity.y, this.velocity.y/2);
            else
                this.velocity.y = Math.min(this.velocity.y, 0);
        }
        this.previousCollision = collision;
        this.location.add(this.velocity)

        // move the camera
        if (this.isAlive) {
            var dx = this.canvasHelper.offset.x + this.canvasHelper.getWidth()/2 - this.location.x
            var dy = this.canvasHelper.offset.y + this.canvasHelper.getHeight()/2 - this.location.y
            this.canvasHelper.offset.x -= 1*10**-17*dx**7
            this.canvasHelper.offset.y -= 1*10**-17*dy**7
        }

        if (this.location.y > 5000) this.kill()
    }


    public playerCollision(
        collideWith: Array<Entity>
    ): CollisionDirections {
        this.leftCollision.updateLocation(this.location.copy().add(new Vector(-this.size.x/2, 0)));
        this.rightCollision.updateLocation(this.location.copy().add(new Vector(this.size.x/2, 0)));
        this.topCollision.updateLocation(this.location.copy().add(new Vector(0, -this.size.y/2)));
        this.bottomCollision.updateLocation(this.location.copy().add(new Vector(0, this.size.y/2)));
        let returnValue = {left: false, right: false, bottom: false, top: false}
        if (collideWith == null) return returnValue;
        collideWith.forEach(e => {
            if (e instanceof Player) return;
            let thisEntityCollision = {left: false, right: false, top: false, bottom: false}
            thisEntityCollision.left = e.collide(this.leftCollision);
            thisEntityCollision.right = e.collide(this.rightCollision);
            thisEntityCollision.bottom = e.collide(this.bottomCollision);
            thisEntityCollision.top = e.collide(this.topCollision);
            if (e instanceof Trampoline && e.collide(this.bottomCollision)) {
                this.trampoline();
                thisEntityCollision.bottom = false;
            }
            if (e instanceof FallingTile && e.collide(this.bottomCollision)) e.activated = true;
            if (
                e instanceof Accelerator &&
                (thisEntityCollision.left || thisEntityCollision.right || thisEntityCollision.top || thisEntityCollision.bottom)
            ) {
                 this.boost(e);
                 return;
            }
            returnValue.left = thisEntityCollision.left || returnValue.left;
            returnValue.right = thisEntityCollision.right || returnValue.right;
            returnValue.bottom = thisEntityCollision.bottom || returnValue.bottom;
            returnValue.top = thisEntityCollision.top || returnValue.top;
            if (thisEntityCollision.left && thisEntityCollision.right && thisEntityCollision.bottom) this.location.y--;
        });
        if (returnValue.bottom) {
            this.isLanded = true;
        } else {
            this.isLanded = false;
        }
        return returnValue;
    }

    public boost(booster: Accelerator) {
        this.velocity = new Vector(booster.getYeet(), 0).rotate(booster.getRotation().getValue());
    }

    public trampoline() {
        this.velocity = new Vector(this.velocity.x,-this.velocity.y-5);
    }

    private jump() {
        new SoundHelper("./assets/sounds/jump.wav")
        this.velocity.y -= this.jumpSpeed;
        this.keyHelper.resetSpaceBar()
        this.jumpCount++;
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

    private kill() {
        this.keyHelper.destroy();
        if (!this.isAlive) return
        this.isAlive = false;
        new SoundHelper("./assets/sounds/GameOver.wav")
        this.velocity.x = 0;
        this.velocity.y = 0;
        let oldGravity = this.gravity;
        this.gravity = 0;
        setTimeout(() => { 
            this.gravity = oldGravity;
            this.velocity.y = -20;
        }, 1750)
        this.switchView(new GameOverView(this))
    }
}

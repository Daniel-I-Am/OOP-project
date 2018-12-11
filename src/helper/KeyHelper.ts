class KeyHelper {
    public leftPressed: boolean;
    public rightPressed: boolean;
    public upPressed: boolean;
    public downPressed: boolean;
    public spaceBarPressed: boolean;
    public interactPressed: boolean;


    /**
     * Adds values to the public variables and adds eventlisteners to the window
     * @constructor
     */
    public constructor() {
        this.leftPressed = false;
        this.upPressed = false;
        this.rightPressed = false;
        this.downPressed = false;
        this.spaceBarPressed = false;
        this.interactPressed = false;
        window.addEventListener("keydown", this.keyDownHandler);
        window.addEventListener("keyup", this.keyUpHandler);
    }

    /**
     * Removes the event listeners
     */
    public destroy(): void {
        window.removeEventListener("keydown", this.keyDownHandler);
        window.removeEventListener("keyup", this.keyUpHandler);
    }

    /**
     * Function to handle the key down
     * @param {KeyboardEvent} event
     */
    private keyDownHandler = (event: KeyboardEvent): void => {
        switch(event.keyCode) {
            case 37:
            case 65:
                    this.leftPressed = true;
                break;
            case 38:
            case 87:
                    this.upPressed = true;
                break;
            case 39:
            case 68:
                    this.rightPressed = true;
                break;
            case 40:
            case 83:
                    this.downPressed = true;
                break;
            case 32:
                    this.spaceBarPressed = true;
                break;
            case 69:
                    this.interactPressed = true;
                break;

        }
    }


    /**
     * Function to handle the key up
     * @param {KeyboardEvent} event
     */
    private keyUpHandler = (event: KeyboardEvent): void => {
        switch(event.keyCode) {
            case 37:
            case 65:
                    this.leftPressed = false;
                break;
            case 38:
            case 87:
                    this.upPressed = false;
                break;
            case 39:
            case 68:
                    this.rightPressed = false;
                break;
            case 40:
            case 83:
                    this.downPressed = false;
                break;
            case 32:
                    this.spaceBarPressed = false;
                break;
            case 69:
                    this.interactPressed = false;
                break;

        }
    }


    /**
    * Function to get the leftPressed property
    */
    public getLeftPressed(): boolean {
        return this.leftPressed;
    }

    /**
    * Function to get the upPressed property
    */
    public getUpPressed(): boolean {
        return this.upPressed;
    }

    /**
    * Function to get the rightPressed property
    */
    public getRightPressed(): boolean {
        return this.rightPressed;
    }

    /**
    * Function to get the downPressed property
    */
    public getDownPressed(): boolean {
        return this.downPressed;
    }

    /**
    * Function to get the downPressed property
    */
    public getSpaceBarPressed(): boolean {
        return this.spaceBarPressed;
    }

    /**
    * Function to get the downPressed property
    */
    public getInteractPressed(): boolean {
        return this.interactPressed;
    }
}

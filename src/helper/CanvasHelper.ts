class CanvasHelper {
    private static instance: CanvasHelper;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    public offset: Vector;

    private constructor(
        canvas: HTMLElement
    ) {
        this.canvas = <HTMLCanvasElement>canvas;
        this.ctx = this.canvas.getContext('2d');
        this.offset = new Vector(0, 0);

        this.canvas.style.width = `${this.canvas.clientWidth}px`
        this.canvas.style.height = `${this.canvas.clientWidth*9/16}px`
        this.canvas.width = 1600;
        this.canvas.height = 900;
    }

    public static Instance(canvas: HTMLElement = null): CanvasHelper {
        if (!this.instance)
            this.instance = new CanvasHelper(canvas);
        return this.instance;
    }

    /**
     * Clears the entire canvas
     */
    public clear(): void {
        this.ctx.clearRect(0, 0, this.getWidth(), this.getHeight());
    }

    /**
     * Writes text to screen
     * @param text Text to write to screen
     * @param fontsize Size of the text
     * @param location Location to put the text at
     * @param align Text alignment to use, default: center
     * @param baseLine Baseline to use when printing, default: middle
     * @param color Color of the text, default: white
     * @param fontFamily Fontface to use, default: Arial
     */
    public writeText(
        text: string,
        fontsize: number,
        location: Vector,
        align: CanvasTextAlign = "center",
        baseLine: CanvasTextBaseline = "middle",
        color: string = "white",
        fontFamily: string = "Arial"
    ): void {
        this.ctx.fillStyle = color;
        this.ctx.font = `${fontsize}px ${fontFamily}`;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = baseLine;
        this.ctx.fillText(text, location.x, location.y);
    }

    /**
     * Draws a rectangle to the canvas
     * @param topLeft Location of the top left point
     * @param bottomRight Location of the bottom right point
     * @param color Color to draw rect at
     */
    public fillRect(
        topLeft: Vector,
        bottomRight: Vector,
        color: string
    ): void {
        this.ctx.save();
        this.ctx.fillStyle = color;
        this.ctx.fillRect(topLeft.x, topLeft.y, bottomRight.x-topLeft.x, bottomRight.y-topLeft.y)
        this.ctx.restore();
    }

    public addProgressBar(
        location: Vector,
        size: Vector,
        filledColor: string,
        emptyColor: string,
        outlineColor: string,
        filledPct: number
    ): void {
        filledPct = Math.min(Math.max(filledPct, 0), 1)
        this.fillRect(
            location.copy().sub(size.copy().multiply(.5)),
            location.copy().add(size.copy().multiply(.5)),
            outlineColor
        );
        this.fillRect(
            location.copy().sub(size.copy().multiply(.5)).add(new Vector(1, 1)),
            location.copy().add(size.copy().multiply(.5)).sub(new Vector(1, 1)),
            emptyColor
        );
        this.fillRect(
            location.copy().sub(size.copy().multiply(.5)).add(new Vector(1, 1)),
            new Vector(
                location.x - size.x * .5 + 1 + filledPct * (size.x - 1),
                location.y + size.y * .5 - 1
            ),
            filledColor
        );
    }

    /**
     * Draws an image to the canvas
     * @param image Image to draw
     * @param location Location to draw the image at
     * @param rotation Amount to rotate the image
     * @param size Size of the image
     */
    public drawImage(
        image: HTMLImageElement,
        location: Vector,
        rotation: Rotation,
        size: Vector,
        scale: Vector = new Vector(1, 1),
        isCentered: boolean = true,
        isGUI: boolean = false,
        opacity: number = 1,
    ): void {
        this.ctx.save();
        this.ctx.globalAlpha = opacity
        if (!isGUI) {
        this.ctx.translate(location.x - this.offset.x, location.y - this.offset.y);
        } else {
            this.ctx.translate(location.x, location.y);
        }
        this.ctx.rotate(rotation.getValue());
        this.ctx.scale(scale.x, scale.y);
        if (Math.min(...size.toArray()) < 0) {
            if (isCentered)
                this.ctx.drawImage(image, -image.width/2, -image.height/2);
            else
                this.ctx.drawImage(image, 0, 0)
        } else {
            if (isCentered)
                this.ctx.drawImage(image, -size.x/2, -size.y/2, size.x, size.y);   
            else
                this.ctx.drawImage(image, 0, 0, size.x, size.y)
        }
        this.ctx.restore();
    }

    /**
     * Draws a button on screen that can be clicked
     * @param src Image to use for the button
     * @param caption Caption to put on the button
     * @param location Location to put the button
     * @param callback What to run when you click the button
     */
    public drawButton(
        image: HTMLImageElement,
        caption: string,
        fontSize: number,
        location: Vector,
        size: Vector,
        callback: (event: MouseEvent) => void = null
    ) {
        this.drawImage(image, location, new Rotation(0), size);
        this.writeText(caption, fontSize, location, "center", "middle", "black")
        if (!callback) return;
        let _listener = (event: MouseEvent) => {
            let croppingFactor = this.getCroppingFactor();
            let xScale = size.x/image.width
            let yScale = size.y/image.height
            // define the top left and bottom right of the button
            let topleft = new Vector(
                this.canvas.offsetLeft + croppingFactor.x * (location.x-xScale*<number>image.width/2),
                this.canvas.offsetTop + croppingFactor.y * (location.y-yScale*<number>image.height/2)
                ),
                bottomRight = new Vector(
                    this.canvas.offsetLeft + croppingFactor.y * (location.x+xScale*<number>image.width/2),
                    this.canvas.offsetTop + croppingFactor.y * (location.y+yScale*<number>image.height/2)
                );
            // check if we clicked within the button
            if (event.x < bottomRight.x && event.x > topleft.x && event.y < bottomRight.y && event.y > topleft.y) {
                // if we did, remove this event listener
                this.canvas.removeEventListener('click', _listener);
                // run the callback provided with the event as argument
                callback(event);
            }
        }
        // actually register the event listener
        this.canvas.addEventListener('click', _listener);
    }

    // Getters and Setters
    public getSize(): Array<number> {
        return [this.getWidth(), this.getHeight()];
    }

    public getCenter(): Vector {
        return new Vector(this.getWidth()/2, this.getHeight()/2);
    }

    public getWidth(): number {
        return this.canvas.width;
    }

    public getHeight(): number {
        return this.canvas.height;
    }

    private getCroppingFactor(): Vector {
        return new Vector(
            this.canvas.clientWidth/this.canvas.width,
            this.canvas.clientHeight/this.canvas.height,
        );
    }
}
class MathHelper {

    /**
     * Returns a random number between min and max
     * @static
     * @param {number} min
     * @param {number} max
     */
    public static randomNumber(min: number, max: number): number {
        return Math.round(Math.random() * (max - min) + min);
    }


    /**
     * Returns degrees into radians
     * @static
     * @param {number} degrees
     */
    public static toRadian(degrees: number): number {
        return degrees * Math.PI / 180;
    }
}

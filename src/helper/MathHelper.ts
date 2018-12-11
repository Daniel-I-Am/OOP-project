class MathHelper {

    /**
     * Returns a random number between (inclusive) min and (exclusive) max
     * @static
     * @param {number} min
     * @param {number} max
     */
    public static randomNumber(min: number, max: number, digits: number = 0): number {
        return Math.floor(Math.random() * (max - min) * 10**digits + min) / 10**digits;
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

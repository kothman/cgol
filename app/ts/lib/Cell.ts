// @todo Write unit tests
class Cell {
    x: number;
    y: number;

    alive: boolean = false;

    static size: number = 200;

    // @todo this should probably use a Point
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;

    }

    toggle() {
        this.alive = !this.alive;
    }

    kill() {
        this.alive = false;
    }

    regen() {
        this.alive = true;
    }

    isAlive() {
        return this.alive;
    }

    getX(): number {
        return Cell.getActualPosition(this.x);
    }

    getY(): number {
        return Cell.getActualPosition(this.y);
    }

    /**
     * Returns the actual position (x or y) based on the cell size
     */
    static getActualPosition(i: number): number {
        return (i * Cell.size);
    }

    static getSize(): number {
        return Cell.size;
    }

    static setSize(x: number) {
        Cell.size = x;
    }

    contains(x: number, y: number): boolean {
        return (
            x >= this.x &&
            x <= Cell.getActualPosition(this.x) &&
            y >= this.y &&
            y <= Cell.getActualPosition(this.y)
        );
    }

    /**
     * Take the mouse offset in the canvas element, mod Cell size, take that amount and trim it
     * from the mouse offset. Divide by cell size.
     */
    static getCellCoordinates(p: Point): Point {
        let x = Math.floor((p.x - (p.x % Cell.size)) / (Cell.size)),
            y = Math.floor((p.y - (p.y % Cell.size)) / (Cell.size));

        return new Point(x, y);
    }

    /**
     * Get Point of Cell
     */
    getPoint(): Point {
        return new Point(this.x, this.y);
    }

}
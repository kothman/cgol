// @todo Write unit tests
class Life {

    cells: Cell[][] = null;
    oldCells: Cell[][] = null;
    newCells: Cell[][] = null;

    canvas: Canvas;

    playPauseButton: HTMLButtonElement;
    stepButton: HTMLButtonElement;
    resetButton: HTMLButtonElement;
    speedRange: HTMLInputElement;
    sizeRange: HTMLInputElement;

    isPlaying: boolean = false;

    height: number = 400;
    width: number = 600;

    speed: number = 1;
    size: number = 1;

    private intervalReference: number;


    constructor(c: Canvas) {
        this.canvas = c;
        this.canvas.setCanvasDimensions();
        this.assignToolbarElements();
        this.createCells();
        this.calculateNewCells();
        Cell.setSize(this.sizeRange.valueAsNumber);
        this.drawAllCells();

        this.addListeners();
    }

    addListeners() {
        this.canvas.getCanvas().addEventListener('click', this.onClick.bind(this));
        window.addEventListener('resize', this.onResize.bind(this));
        this.playPauseButton.addEventListener('click', this.playPause.bind(this));
        this.stepButton.addEventListener('click', this.step.bind(this));
        this.resetButton.addEventListener('click', this.reset.bind(this));
        this.speedRange.addEventListener('change', this.onChangeSpeed.bind(this));
        this.sizeRange.addEventListener('change', this.onChangeSize.bind(this));
    }

    assignToolbarElements() {
        this.playPauseButton = <HTMLButtonElement> document.querySelector('.play-pause-button');
        this.stepButton = <HTMLButtonElement> document.querySelector('.step-button');
        this.resetButton = <HTMLButtonElement> document.querySelector('.reset-button');
        this.speedRange = <HTMLInputElement> document.querySelector('.speed-range');
        this.sizeRange = <HTMLInputElement> document.querySelector('.size-range');
    }

    onClick(e: MouseEvent) {
        let mouseClickPoint = new Point(e.offsetX, e.offsetY);
        let cellCoordinates = Cell.getCellCoordinates(mouseClickPoint);

        // toggle that cell
        let c = this.getCell(cellCoordinates);
        c.toggle();
        this.drawCell(c);
    }

    onResize() {
        if (Canvas.canResize())
            this.drawAllCells();
    }

    onChangeSpeed() {
        let wasPlaying = this.isPlaying;
        if (this.isPlaying)
            this.pause();
        this.speed = this.speedRange.valueAsNumber;
        if (wasPlaying)
            this.play();
    }

    onChangeSize() {
        Cell.setSize(this.sizeRange.valueAsNumber);
        this.createCells();
        this.drawAllCells();
    }

    createCells() {
        this.cells = [];
        for (let y = 0; y < this.height; y++) {
            this.cells.push([]);
            for (let x = 0; x < this.width; x++) {
                let c: Cell = new Cell(x, y);
                this.cells[y].push(c);
            }
        }
    }

    /**
     * Draw a given cell on the canvas
     */
    drawCell(c: Cell) {
        if (this.cellOffScreen(c)) {
            c.kill();
            return;
        }
        let ctx = this.canvas.getContext();
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
        ctx.fillRect(c.getX(), c.getY(), Cell.getSize(), Cell.getSize());
        if (!c.alive) {
            // Had some weird issues with using ctx.strokeRect,
            // seemed to create a larger rectangle than just ctx.fillRect
            ctx.clearRect(c.getX() + 1, c.getY() + 1, Cell.getSize() - 2, Cell.getSize() - 2);
        }

    }

    /**
     * Go through matrix and call this.drawCell on all cells
     */
    drawAllCells() {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.drawCell(this.getCell(new Point(x, y)));
            }
        }
    }

    /**
     * Get a specific cell from the matrix, given a point
     */
    getCell(p: Point): Cell {
        return this.cells[p.y][p.x];
    }

    /**
     * Check if the cell is off screen
     */
    cellOffScreen(c): boolean {
        return c.getX() + Cell.getSize() > this.canvas.getWidth() || c.getY() + Cell.getSize() > this.canvas.getHeight();

    }

    /**
     * Get matrix of all surrounding/adjacent cells
     */
    getSurroundingCells(c: Cell): Cell[] {
        let cells = [];

        // @todo Figure out a more elegant way to do this?
        if (c.x - 1 >= 0) {
            cells.push(
                this.getCell(new Point(c.x - 1, c.y))
            );
        }
        if (c.x - 1 >= 0 && c.y - 1 >= 0) {
            cells.push(
                this.getCell(new Point(c.x - 1, c.y - 1))
            );
        }
        if (c.x - 1 >= 0 && c.y + 1 < this.height) {
            cells.push(
                this.getCell(new Point(c.x - 1, c.y + 1))
            );
        }
        if (c.x + 1 < this.width) {
            cells.push(
                this.getCell(new Point(c.x + 1, c.y))
            );
        }
        if (c.y - 1 >= 0 && c.x + 1 < this.width) {
            cells.push(
                this.getCell(new Point(c.x + 1, c.y - 1))
            );
        }
        if (c.x + 1 < this.width && c.y + 1 < this.height) {
            cells.push(
                this.getCell(new Point(c.x + 1, c.y + 1))
            );
        }
        if (c.y + 1 < this.height) {
            cells.push(
                this.getCell(new Point(c.x, c.y + 1))
            );
        }
        if (c.y - 1 >= 0) {
            cells.push(
                this.getCell(new Point(c.x, c.y - 1))
            );
        }

        return cells;
    }

    /**
     * Check if the cell should die off. Rule applied directly to cell.
     */
    shouldCellDieRule(c: Cell) {
        let cells = this.getSurroundingCells(c);
        let aliveCells = cells.filter(function (cell, index, array) {
            return cell.isAlive();
        });
        if (c.isAlive() && (aliveCells.length > 3 || aliveCells.length < 2))
            c.kill();
    }

    /**
     * Check if the cell should be brought back to life. Rule applied directly to cell.
     */
    shouldCellRegenerateRule(c: Cell) {
        let cells = this.getSurroundingCells(c);
        let aliveCells = cells.filter(function (cell, index, array) {
            return cell.isAlive();
        });
        if (!c.isAlive() && (aliveCells.length == 3)) {
            c.regen();
        }
    }

    applyRules(c: Cell): Cell {
        let newCell = Life.cloneCell(c);
        if (c.isAlive()) {
            this.shouldCellDieRule(newCell);
        } else {
            this.shouldCellRegenerateRule(newCell);
        }

        return newCell;
    }

    /**
     * Make a clone of a cell
     */
    static cloneCell(c: Cell): Cell {
        let newCell = new Cell(c.x, c.y);
        c.isAlive() ? newCell.regen() : newCell.kill();
        return newCell;
    }

    /**
     * Calculate matrix of cells for the next step, based on applied rules
     */
    calculateNewCells() {
        this.newCells = [];
        for (let y = 0; y < this.height; y++) {
            this.newCells.push([]);
            for (let x = 0; x < this.width; x++) {
                let c = this.getCell(new Point(x, y));
                c = this.applyRules(c);
                this.newCells[y].push(c);
            }
        }
    }

    /**
     * Step forward one generation
     */
    step() {
        this.calculateNewCells();
        this.oldCells = this.cells;
        this.cells = this.newCells;
        this.drawAllCells();
    }

    /**
     * Being automatically stepping forward until told to stop, at the saved rate
     */
    play() {
        this.playPauseButton.classList.remove('paused')
        this.playPauseButton.classList.add('playing');
        this.playPauseButton.querySelector('.text').innerHTML = 'Pause';
        this.step();
        this.intervalReference = setInterval(function () {
            this.step();
        }.bind(this), 1000 / this.speed);
    }

    /**
     * Stop stepping forward
     */
    pause() {

        this.playPauseButton.classList.remove('playing');
        this.playPauseButton.classList.add('paused');
        this.playPauseButton.querySelector('.text').innerHTML = 'Play';
        clearInterval(this.intervalReference);
    }

    reset() {
        if (this.isPlaying) {
            this.pause();
        }
        this.clear();

    }

    clear() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let c = this.getCell(new Point(x, y));
                c.kill();
            }
        }
        this.drawAllCells();
    }

    playPause() {
        this.isPlaying ? this.pause() : this.play();
        this.isPlaying = !this.isPlaying;
    }

}
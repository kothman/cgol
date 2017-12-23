// @todo Write unit tests
class Canvas {
    canvas: HTMLCanvasElement;
    height: number;
    width: number;
    static lastResize: number;

    ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        Canvas.lastResize = Date.now();
        this.ctx = this.canvas.getContext("2d");

        console.log("Initializing canvas");

        this.setCanvasDimensions();
        this.applyResizeListener();
    }

    /**
     * Apply resize listener on the window & update canvas dimensions on resize
     */
    applyResizeListener() {
        window.addEventListener('resize', function(e) {
            if (Canvas.canResize()) {
                this.setCanvasDimensions();
            }
        }.bind(this));
    }

    setCanvasDimensions() {
        let canvasDimensions = this.canvas.parentElement.getBoundingClientRect();
        this.setWidth(canvasDimensions.width);
        this.setHeight(canvasDimensions.height);
    }

    setWidth(w: number) {
        this.width = w - (w % Cell.size);
        this.canvas.setAttribute("width", this.getWidth().toString());
        this.canvas.style.width = this.getWidth().toString() + "px";
    }

    setHeight(h: number) {
        this.height = h - (h % Cell.size);
        this.canvas.setAttribute("height", this.getHeight().toString());
        this.canvas.style.height = this.getHeight().toString() + "px";
    }

    getHeight(): number {
        return this.height;
    }
    getWidth(): number {
        return this.width;
    }

    getContext(): CanvasRenderingContext2D {
        return this.ctx;
    }

    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    static canResize(): boolean {
        let now: number = Date.now();
        return now - 1000 >= Canvas.lastResize;
    }

}
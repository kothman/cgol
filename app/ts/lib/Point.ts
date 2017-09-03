// @todo Write unit tests
class Point {

    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    log() {
        console.log('(' + this.x + ', ' + this.y + ')');
    }

}
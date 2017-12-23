describe('Canvas', function() {

    beforeEach(function() {
	var bodyElement = document.createElement('body');
	var canvasElement = document.createElement('canvas');
	bodyElement.appendChild(canvasElement);
	this.canvas = new Canvas(canvasElement);
    });

    it('initialized', function() {
	expect(true).toBe(true);
	expect(this.canvas.ctx).not.toBe(null);
	expect(this.canvas.width).not.toBe(null);
	expect(this.canvas.height).not.toBe(null);
    });

    it('can set width', function () {
	this.canvas.setWidth(801);
	expect(this.canvas.getWidth()).toBe(800);
    });

    it('can set height', function () {
	this.canvas.setHeight(801);
	expect(this.canvas.getHeight()).toBe(800);
    });

});

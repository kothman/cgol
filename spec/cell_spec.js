describe('Cell', function() {

    it('gets created with the correct x and y values', function () {
	var c = new Cell(10, 20);
	expect(c.getX()).toBe(2000);
	expect(c.getY()).toBe(4000);
    });

    it('can can die and regenerate', function () {
	var c = new Cell(0, 0);
	expect(c.isAlive()).toBe(false);
	c.regen();
	expect(c.isAlive()).toBe(true);
	c.kill();
	expect(c.isAlive()).toBe(false);
    });
    
    it('can return the actual matrix postiion', function() {
	var c = new Cell(10, 10);
	Cell.setSize(1);
	var pos = Cell.getCellCoordinates(c.getPoint());
	expect(pos.x).toBe(2);
	expect(pos.y).toBe(2);
    });
    
});

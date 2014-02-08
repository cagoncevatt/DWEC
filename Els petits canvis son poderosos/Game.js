// Game class constructor
function Game(type) {
	this.type = type;
	this.table = new Table();
	this.rules = new Rules();
	
	this.initGame = function(x, y, a, b) {
		game.table.paintTable(x, y, a, b);
		game.table.createDrop('.gridBox');
		game.table.createDrag();
		game.rules.firstAction();
	}
	// End game message, only used for first two games in this case
	this.endGame = function() {
		if (game.type < 2)
			alert("Congratulations, you have just seen how ideals can affect our society!");
	}
	// Modify type of game or required number of neighbors
	this.renewParams = function(req, type) {
		this.type = type;
		this.rules.requiredNum = req;
		game.rules.firstAction();
	}
}
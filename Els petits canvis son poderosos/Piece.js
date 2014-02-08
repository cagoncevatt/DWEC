// Piece class constructor
function Piece(id, type) {
	this.id = id; 
	this.type = type;
	this.state = 1;
	
	// Execute action, used to search for pieces around
	this.action = function(callback, callbackTwo) {
		var id = '#piece-' + this.id;
		var parent = game.table.lookInGrid($(id).parent().attr('id'));
		
		if (callback(parent.x, parent.y, callbackTwo('', false), this, false))
			this.changeState(0);
		else
			this.changeState(1);
	}
	// Change the state of the piece, if called is because it had to be changed
	this.changeState = function(state) {
		// Exe will verify if when the change state, specified by rules, the state should become active/inactive or simply active (this is mainly for the mid-game rules modification system)
		var exe = game.rules.pieceChangeState();
		
		if (exe)
		{
			if (state == 0 && this.state == 1)
				game.table.modifyAmount(this, true);
			else if (state == 1 && this.state == 0)
				game.table.modifyAmount(this, false);
		}
		
		this.state = state;
		
		// Change the visual of the pieces depending on what is specified in rules
		this.changeVisualState(exe);
	}
	
	// When called will verify the rules and mark which are allowed grid boxes to move to
	this.move = function(callback, elem) {
		callback(elem, true);
	}
	// Change pieces visual dependind on the actual state
	this.changeVisualState = function(notRemove) {
		var id = '#piece-' + this.id;
		var selector = id + ' .pieceState';
		
		// Not remove is to make changes in the state of the piece with visual effects, while remove will clean the inside (the face)
		if (!notRemove)
		{
			$(id).draggable('option', 'disabled', false);
			$(selector).removeClass('angryPiece');
			$(selector).removeClass('happyPiece');
		}
		else
		{
			if (this.state == 0)
			{
				$(id).draggable('option', 'disabled', true);
				$(selector).removeClass('angryPiece');
				$(selector).addClass('happyPiece');
			}
			else
			{
				$(id).draggable('option', 'disabled', false);
				$(selector).addClass('angryPiece');
				$(selector).removeClass('happyPiece');
			}
		}
	}
}
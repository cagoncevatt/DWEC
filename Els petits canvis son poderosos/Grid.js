// Grid class constructor
function Grid(x, y) {
	this.x = x;
	this.y = y;
	this.piece;
	
	// Paint the piece in html with the element passed as a parameter
	this.paintPiece = function(inner) {
			var tableGrid = document.getElementById('gridBox-'+this.x+'-'+this.y);
			tableGrid.innerHTML = inner;
	}
	// Delete the piece from the source and the html element
	this.deletePiece = function() {
		this.piece = undefined;
		var tableGrid = document.getElementById('gridBox-'+this.x+'-'+this.y);
		tableGrid.innerHTML = '';
	}
	// Create the first piece of this grid cell
	this.createPiece = function(id, type) {
		this.piece = new Piece(id, type);
		this.setVisualPiece();
	}
	// Setter for the piece in the source code
	this.setPiece = function(piece) {
		if (typeof this.piece != 'undefined')
			game.table.modifyAmount(this.piece, true);
		this.piece = piece;
	}
	// Setter for the visual piece that calls paintPiece after it finishes
	this.setVisualPiece = function() {
		if (typeof this.piece != 'undefined' && typeof this.piece != 'null')
		{
			var pieceClass = this.piece.type;
			var pieceState = this.piece.state;
			var gameType = game.type;
			var inner;
			
			switch(gameType)
			{
				case 0: // Racist
				case 1: // Convivence						
					if (pieceState == 1)
						pieceState = 'angryPiece';
					else
						pieceState = 'happyPiece';
					
					if (pieceClass == 0)
						pieceClass = "redPiece";
					else
						pieceClass = "greenPiece";
					break;
				case 2: // Custom type 2 - Thrill of the hunt
					if (pieceClass == 0)
						pieceClass = "APiece";
					else
						pieceClass = "BPiece";
					break;
				default:
					pieceClass = "classDefault";
					pieceState = "";
					break;	
			}
			inner = '<div id="piece-'+ this.piece.id +'" class="piece '+ pieceClass + '"><div class="pieceState '+ pieceState +'"></div></div>';
			this.paintPiece(inner);
		}
	}
	this.dropState = function(state) {
		var id = '#gridBox-' + this.x + '-' + this.y;
		$(id).droppable('option', 'disabled', state);
	}
}
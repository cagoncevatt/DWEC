// Table class constructor
function Table() {
	this.table = new Array();
	this.amountA = 0;
	this.amountB = 0;

	// Create the visual table in html
	this.paintTable = function(dimensionX, dimensionY, maxA, maxB) {
		var tableSpace = document.getElementById('gameTable');
		var gridCode = '';
		
		for (var i = 0; i < dimensionY; i++)
			for (var j = 0; j < dimensionX; j++)
			{
				gridCode += '<div id="gridBox-'+ i +'-'+ j +'" class="gridBox"></div>';
				if (j == dimensionX-1)
					gridCode += '<br>';
			}
			
		tableSpace.innerHTML = gridCode;
		tableSpace.style.display = 'block';
		this.initializeTable(dimensionX, dimensionY, maxA, maxB, game.rules.getPiecesGen());
	}
	// Initialize the table in the source
	this.initializeTable = function(dimensionX, dimensionY, maxA, maxB, callback) {
		var completed = false;
		var it = 0;		
		
		// First we initialize
		for (var i = 0; i < dimensionY; i++)
		{
			if(typeof this.table[i] != 'Object')
			{
				var newArray = new Array();
				this.table.push(newArray);
			}
				
			for (var j = 0; j < dimensionX; j++)
			{
				if (typeof this.table[i][j] != 'Object')
					this.table[i][j] = new Grid(i, j);
			}
		}
		// Then loop until we create all of the pieces in mostly random grid cells, is made in this order to avoid failures while printing
		while (!completed)
		{
			for (var i = 0; i < dimensionY; i++)
			{
				for (var j = 0; j < dimensionX; j++)
				{
					// Print rules	
					completed = callback(i, j, it, maxA, maxB);
				}
			}
			
			it++;
			// When we have all the pieces created, completed becomes true and the loop ends
			if (this.amountA >= maxA && this.amountB >= maxB)
				completed = true;
		}
	}
	// Used by rules to see if a piece can move - callback should be a function that returns a boolean depending on what the rules want and callbackSec compareAround
	this.seeAllInGrid = function(callback, elem, callbackSec, verif) {
		for (var i = 0; i < this.table.length; i++)
			for (var j = 0; j < this.table[i].length; j++)
			{
				if (game.rules.evaluateDrop(verif, this.table[i][j].piece, callback, callbackSec, i, j, elem, false))
				{
					this.table[i][j].dropState(false);
				}
				else
					this.table[i][j].dropState(true);
			}
	}	
	// Looks for a grid element based on the id of the div container (matches the visual grid with the one in the source code)
	this.lookInGrid = function(elementId) {
		var values = elementId.split('-');
		
		return this.table[values[1]][values[2]];
	}
	this.createDrop = function(dropSelector) {
		$(dropSelector).droppable({
			accept: '.piece',
			activeClass: 'selectable',
			hoverClass: 'selectableHover',
			drop: function(event, ui) {
				var droppedIn;
				var gridElem = game.table.lookInGrid(ui.draggable.parent().attr('id'));
				var draggingElem = gridElem.piece;

				gridElem.deletePiece();
				ui.draggable.removeAttr('style');
				ui.draggable.css('position', 'relative');
				$(this).html(ui.draggable);
				droppedIn = game.table.lookInGrid($(this).attr('id'));
				droppedIn.setPiece(draggingElem);
				draggingElem.action(game.rules.getComparison(), game.rules.getRules());
				if (game.type < 2)
				{
					// This should happen if the game is not custom
					var funct = game.rules.getRules();
					game.rules.compareAround(gridElem.x, gridElem.y, funct('', false), draggingElem, true);
					game.rules.compareAround(droppedIn.x, droppedIn.y, funct('', false), draggingElem, true);
				}
				$(this).droppable('option', 'disabled', true);
			},
			create: function (event, ui) {
				$(this).droppable('option', 'disabled', true);
			}
		});
	}
	this.createDrag = function() {
		$('.piece').draggable({
			containment: '#gameTable',
			revert: 'invalid',
			stack: '.piece',
			scroll: true,
			start: function(event, ui) {
				var draggedFrom, draggingElem;
				
				draggedFrom = game.table.lookInGrid($(this).parent().attr('id'));
				draggingElem = draggedFrom.piece;
				draggingElem.move(game.rules.getRules(), draggingElem);
			}
		});
	}
	this.modifyAmount = function(piece, less) {
		if (piece.type == 0)
		{
			if (less)
				this.amountA--;
			else
				this.amountA++;
		}
		else
		{
			if (less)
				this.amountB--;
			else
				this.amountB++;
		}
		game.rules.comproveEnd();
	}
	// Getters for amount of pieces
	this.getAmountA = function() {
		return this.amountA;
	}
	this.getAmountB = function() {
		return this.amountB;
	}
}

// Rules class constructor
function Rules() {	
	this.requiredNum = $('#gamePieceC').val();
	
	// In the "rulesX" function the number equals the game type it represents
	this.rules0 = function(elem, all) {
		// Rules of game 1, type 0
		if (all)
			game.table.seeAllInGrid(game.rules.lookEqual, elem, game.rules.compareAround, true);
		else
			return game.rules.lookEqual;
	}
	
	this.rules1 = function(elem, all) {
		// Rules of game 2, type 1
		if (all)
			game.table.seeAllInGrid(game.rules.lookDiff, elem, game.rules.compareAround, true);
		else
			return game.rules.lookDiff;
	}
	
	this.rules2 = function(elem, all) {
		// Rules of game 3, type 2
		if (all)
			game.table.seeAllInGrid(game.rules.lookEqualAround, elem, game.rules.customRule, false);
		else
			return game.rules.lookEqualAround;
	}
	
	/*
	 * New rules base should go in this space!
	 */
	
	// This will allow the dynamic selection of rules by only creating the rulesX function where X is always a number that equals the game type
	this.getRules = function() {
		var sep;
		
		for (var x in this) {
			sep = x.split('rules');
			if (sep[1] == game.type)
				return this[x];
		}
	}
	// If necessary we execute action for each piece at the beginning
	this.firstAction = function() {
		for (var i = 0; i < game.table.table.length; i++)
			for (var j = 0; j < game.table.table[i].length; j++)
				if (typeof game.table.table[i][j].piece != 'undefined')
					game.table.table[i][j].piece.action(game.rules.getComparison(), game.rules.getRules());
	}
	// Get which kind of searcher use
	this.getComparison = function() {
		if (game.type < 2)
			return this.compareAround;
		else if (game.type == 2)
			return this.customRule;
		else
			return undefined;
	}
	// Look for same type of pieces
	this.lookEqual = function(first, sec) {
		if (first.type == sec.type && first.id != sec.id)
			return true;
		else
			return false;
	}
	// Look for different types of pieces
	this.lookDiff = function(first, sec) {
		if (first.type != sec.type && first.id != sec.id)
			return true;
		else
			return false;
	}
	// Look around considering self
	this.lookEqualAround = function(first, sec) {
		if (first.type == sec.type)
			return true;
		else
			return false;
	}
	// If the space should allow droppable or not
	this.evaluateDrop = function(verify, piece, callback, callbackSec, i, j, elem, bool) {
	 	if (verify)
	 	{
	 		if (typeof piece == 'undefined' && callbackSec(i, j, callback, elem, false))
	 			return true;
	 		else
	 			return false;
	 	}
	 	else // For custom game, pieces eat each other
	 		if (typeof piece == 'undefined')
	 			return true;
	 		else if (piece.type != elem.type && callbackSec(i, j, callback, elem, false))
	 			return true;
	 		else
	 			return false;
	 }
	 // Pieces printing rules
	 this.printRulesRandom = function(i, j, it, maxA, maxB) {
	 	var create = 0;
	 	var type = 0;
	 	var amountA, amountB;
	 	var pieceId;
	 	
	 	amountA = game.table.getAmountA();
	 	amountB = game.table.getAmountB();
	 	
	 	if(typeof game.table.table[i][j].piece == 'undefined' || typeof game.table.table[i][j].piece == 'null' || typeof game.table.table[i][j].piece == 'Boolean')
		{
			// We randomly try to create pieces 250 times, after that we just allow the creation in the first available space 
			if (it < 250)
				create = Math.round(Math.random());
			else
				create = 1;
					
			// If "create" is 1, then we try to create an A or B piece in the actual grid cell
			if (create == 1)
			{
				type = Math.round(Math.random());
				// In both cases, if the amount of pieces is less than de limit then we create the new one
				if (type == 0)
				{
					if (amountA < maxA)
					{
						game.table.amountA++;
						pieceId = 'A-'+amountA;
						game.table.table[i][j].createPiece(pieceId, type);
					}
				}
				else
				{
					if (amountB < maxB)
					{
						game.table.amountB++;
						pieceId = 'B-'+amountB;
						game.table.table[i][j].createPiece(pieceId, type);
					}
				}
			}
		}
		return false;
	 }
	 // Print rules rows
	 this.printRulesRows = function(i, j, it) {
	 	var amountA, amountB;
	 	var pieceId;
	 	var type;
	 	
	 	amountA = game.table.getAmountA();
	 	amountB = game.table.getAmountB();
	 	
	 	// Fill the first and last two rows of the table
	 	if(i <= 1 || i >= game.table.table.length - 2)
		{
			if (i <= 1)
			{
				type = 0;
				game.table.amountA++;
				pieceId = 'A-'+amountA;
				game.table.table[i][j].createPiece(pieceId, type);
			}
			else if (i >= game.table.table.length - 2)
			{
				type = 1;
				game.table.amountB++;
				pieceId = 'B-'+amountB;
				game.table.table[i][j].createPiece(pieceId, type);
			}
		}
		return true;
	 }
	 // If the pieces have 2 states or are just normal pieces without on/off state, depends on the type of game
	 this.pieceChangeState = function() {
	 	switch (game.type)
	 	{
	 		case 0:
	 		case 1:
	 			return true;
	 			break;
	 			
	 		case 2:
	 			return false;
	 			break;
	 			
	 		default:
	 			break;
	 	}
	 }
	 // Getter for rules
	 this.getPiecesGen = function() {
	 	if (game.type < 2)
	 		return this.printRulesRandom;
	 	else if (game.type == 2)
	 		return this.printRulesRows;
	 }
	 // Compare pieces around the sent indexed
	 this.compareAround = function(x, y, callback, sec, action) {
		var final = false;
		var count = 0;
		var first;
		
		if (x - 1 >= 0)
		{
			first = game.table.table[x-1][y].piece;
			
			if (typeof first != 'undefined')
				if (callback(first, sec))
				{
					if (action)
						first.action(game.rules.compareAround, game.rules.getRules());
					else
						count++;
				}
		}
		
		if (y - 1 >= 0)
		{
			first = game.table.table[x][y-1].piece;
			
			if (typeof first != 'undefined')
				if (callback(first, sec))
				{
					if (action)
						first.action(game.rules.compareAround, game.rules.getRules());
					else
						count++;
				}
		}
		
		if (x - 1 >= 0 && y - 1 >= 0)
		{
			first = game.table.table[x-1][y-1].piece;
			
			if (typeof first != 'undefined')
				if (callback(first, sec))
				{
					if (action)
						first.action(game.rules.compareAround, game.rules.getRules());
					else
						count++;
				}
		}
		
		if (y - 1 >= 0 && x + 1 < game.table.table.length)
		{
			first = game.table.table[x+1][y-1].piece;
			
			if (typeof first != 'undefined')
				if (callback(first, sec))
				{
					if (action)
						first.action(game.rules.compareAround, game.rules.getRules());
					else
						count++;
				}
		}
		
		if (x + 1 < game.table.table.length)
		{
			first = game.table.table[x+1][y].piece;
			
			if (typeof first != 'undefined')
				if (callback(first, sec))
				{
					if (action)
						first.action(game.rules.compareAround, game.rules.getRules());
					else
						count++;
				}
		}
		
		if (y + 1 < game.table.table[x].length && x + 1 < game.table.table.length)
		{
			first = game.table.table[x+1][y+1].piece;
			
			if (typeof first != 'undefined')
				if (callback(first, sec))
				{
					if (action)
						first.action(game.rules.compareAround, game.rules.getRules());
					else
						count++;
				}
		}
		
		if (y + 1 < game.table.table[x].length)
		{
			first = game.table.table[x][y+1].piece;
			
			if (typeof first != 'undefined')
				if (callback(first, sec))
				{
					if (action)
						first.action(game.rules.compareAround, game.rules.getRules());
					else
						count++;
				}
		}
		
		if (y + 1 < game.table.table[x].length && x - 1 >= 0)
		{
			first = game.table.table[x-1][y+1].piece;
			
			if (typeof first != 'undefined')
				if (callback(first, sec))
				{
					if (action)
						first.action(game.rules.compareAround, game.rules.getRules());
					else
						count++;
				}
		}
		
		if (count >= game.rules.requiredNum)
			final = true;
		
		return final;
	}
	// Comprove if a game is over after a piece changed it's state
	this.comproveEnd = function() {
		switch(game.type)
		{
			case 0:
			case 1:
				if (game.table.amountA == 0 && game.table.amountB == 0)
					game.endGame();
				break;
				
			case 2:
				if (game.table.amountA == 0 || game.table.amountB == 0 || (game.table.amountA == 1 && game.table.amountB == 1))
					game.endGame();
				break;
				
			default:
				break;
		}
	}
	// Custom game - pieces finder
	this.customRule = function(x, y, callback, sec, action) {
		var final = false;
		var countAlly = 0;
		var countEnemy = 0;
		var first;
		
		if (x - 1 >= 0)
		{
			first = game.table.table[x-1][y].piece;
			
			if (typeof first != 'undefined')
				if (callback(first, sec))
					countAlly++;
				else
					countEnemy++;
		}
		
		if (y - 1 >= 0)
		{
			first = game.table.table[x][y-1].piece;
			
			if (typeof first != 'undefined')
				if (callback(first, sec))
					countAlly++;
				else
					countEnemy++;
		}
		
		if (x - 1 >= 0 && y - 1 >= 0)
		{
			first = game.table.table[x-1][y-1].piece;
			
			if (typeof first != 'undefined')
				if (callback(first, sec))
					countAlly++;
				else
					countEnemy++;
		}
		
		if (y - 1 >= 0 && x + 1 < game.table.table.length)
		{
			first = game.table.table[x+1][y-1].piece;
			
			if (typeof first != 'undefined')
				if (callback(first, sec))
					countAlly++;
				else
					countEnemy++;
		}
		
		if (x + 1 < game.table.table.length)
		{
			first = game.table.table[x+1][y].piece;
			
			if (typeof first != 'undefined')
				if (callback(first, sec))
					countAlly++;
				else
					countEnemy++;
		}
		
		if (y + 1 < game.table.table[x].length && x + 1 < game.table.table.length)
		{
			first = game.table.table[x+1][y+1].piece;
			
			if (typeof first != 'undefined')
				if (callback(first, sec))
					countAlly++;
				else
					countEnemy++;
		}
		
		if (y + 1 < game.table.table[x].length)
		{
			first = game.table.table[x][y+1].piece;
			
			if (typeof first != 'undefined')
				if (callback(first, sec))
					countAlly++;
				else
					countEnemy++;
		}
		
		if (y + 1 < game.table.table[x].length && x - 1 >= 0)
		{
			first = game.table.table[x-1][y+1].piece;
			
			if (typeof first != 'undefined')
				if (callback(first, sec))
					countAlly++;
				else
					countEnemy++;
		}
		
		// If there are more allies than enemies then pieces is killable
		if (countAlly > countEnemy + 1)
			final = true;
		
		return final;
	}
}

// Create the game if the parameters are valid
function validGame() {
	var x, y, a, b, req, type, confX, confY, confXMin, confYMin;
	
	type = parseInt($('input[name=gameType]:checked', '#radioGroup').val());
	req = document.getElementById('gamePieceC').value;
	req = parseInt(req);
	x = document.getElementById('gameTableX').value;
	x = parseInt(x);
	confX = parseInt($('#gameTableX').attr('max'));
	confXMin = parseInt($('#gameTableX').attr('min'));
	y = document.getElementById('gameTableY').value;
	y = parseInt(y);
	confY = parseInt($('#gameTableY').attr('max'));
	confYMin = parseInt($('#gameTableY').attr('min'));
	a = document.getElementById('gamePieceA').value;
	a = parseInt(a);
	b = document.getElementById('gamePieceB').value;
	b = parseInt(b);
	
	switch(type)
	{
		case 0:
		case 1:
			if (!isNaN(req) && !isNaN(x) && !isNaN(y) && !isNaN(a) && !isNaN(b) && ((x <= confX && y <= confY) && (x >= confXMin && y >= confYMin)))
			{
				if (x*y > a+b)
				{
					if (req < a && req < b)
					{	
						$('#gameTable').css('visibility', 'visible');					
						game = new Game(type);
						game.initGame(x, y, a, b);
					}
					else
						alert("There should be enough pieces to match the required number of neighbors.")
				}
				else
					alert("The dimensions of the table should have enough grid boxes to contain all the pieces.");
			}
			else
				alert("The value of one or more parameters are invalid.");
			break;
			
		case 2:
			if (!isNaN(x) && !isNaN(y))
			{
				if ((y >= 5 && x >= 3) && x <= confX && y <= confY)
				{
					$('#gameTable').css('visibility', 'visible');
					type = parseInt($('input[name=gameType]:checked', '#radioGroup').val());
					
					game = new Game(type);
					game.initGame(x, y, a, b);
				
				}
				else
					alert("The dimensions of the table should have enough grid boxes to contain all the pieces.");
			}
			else
				alert("The values of one or more parameters are invalid.");
			break;
			
		default:
			break;
	}
	
	
}

// Modify some values from the game (type) and rules (required number of neighbors) - This can cause malfunctions with the comprovation of ending conditions, specially when changing to Thrill of the Hunt
function modifyParameters() {
	var req, type;
	
	if (typeof game != 'undefined' && typeof game != 'null')
	{
		req = document.getElementById('gamePieceC').value;
		req = parseInt(req);
		
		if (!isNaN(req))
		{
			type = parseInt($('input[name=gameType]:checked', '#radioGroup').val());
			
			game.renewParams(req, type);
		}
		else
			alert("The value of one or more parameters are invalid.");
	}
	else
		alert("There isn't a game created.");
}

// Disable piece options if Thrill of the Hunt and display of respective game mini-rules on the rules section below
function activeOptions() {
	var type = $('input[name=gameType]:checked', '#radioGroup').val();
	
	switch(type)
	{
		case '0':
			$('.pieceDefine').removeAttr('disabled');
			$('#rulesSegregation').show(500);
			$('#rulesAcceptation').hide(500);
			$('#rulesThrillOfTheHunt').hide(500);
			break;
		case '1':
			$('.pieceDefine').removeAttr('disabled');
			$('#rulesSegregation').hide(500);
			$('#rulesAcceptation').show(500);
			$('#rulesThrillOfTheHunt').hide(500);
			break;
			
		case '2':
			$('.pieceDefine').attr('disabled', 'disabled');
			$('#rulesSegregation').hide(500);
			$('#rulesAcceptation').hide(500);
			$('#rulesThrillOfTheHunt').show(500);
			break;
			
		default:
			break;
	}
}

// Initialization of listeners and invisible divs
$(document).ready(function() {
	$("#settings").click(function(){
		$("#mainOptCont").toggle(1000);
		$("#choices").toggle(1000);
	});
	
	$("#rulesToggle").click(function(){
		$("#rulesDisplay").toggle(1000);
	});
	
	$('#gameTable').css('visibility', 'hidden');
	$('#rulesDisplay').css('display', 'none');
	$('#rulesAcceptation').css('display', 'none');
	$('#rulesThrillOfTheHunt').css('display', 'none');
});


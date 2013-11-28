var race = new Array();
var teams = new Array();
var teamsName = new Array('Ag2r La Mondiale', 'Astana Pro Team', 'Blanco Pro Cycling Team', 'BMC Racing Team', 'Movistar Team', 'Saxo Tinkoff');
var totalTurns;
var membersAmount;
var playersSelected = 0;

/*--------- templates -----		  0      1            2               3              4
/var teamMember = new Array(); [name] [role] [maxMetersPerTurn] [metersMoved] [memberHistory]
var memberHistory = new Array();
----------------------------------------------------*/

var progressWidth; // Variable that will contain the actual bars width to control images don't going outside the limits
var teamMembersStartIndex = 1; // Team members will begin from index 1. Index 0 is for the team's name.
var teamsStartIndex = 2; // Teams in race will start at index 2. Indexes 0 and 1 are for turns and date

// Jquery listeners assigned once the document finishes charging, also we add any function we want to execute when this happens
$(document).ready(function(){
	$('#firstMain #startRaceBtn').click(function (e) {
		activateTeams();
		$('a[href="#gameCont"]').tab('show');
	});
	
	$('#gameCont #exitRaceBtn').click(function (e) {
		e.preventDefault();
		$('a[href="#firstMain"]').tab('show');
	});
	
	showTeams();
});

// Define members max amount
function setMembers() {
	membersAmount = $('#membAmount').val();
}

// Obtain percentages of bars width
function calculatePercentWidth(id) {
	var elementId = '#'+id;
	
	var width = $(elementId).width(); 
	var parentWidth = $(elementId).offsetParent().width();
	var percentWidth = 100*width/parentWidth;
	
	return percentWidth;
}

// Display a div from the modal body and change the title
function modalInfo(title) {
	document.getElementById('genericModalTitle').innerHTML = title;
	
	resetModal();
	
	switch(title) {
		case 'Load Race':
			document.getElementById('loadRace').setAttribute('class', 'modalOptionActive');
			break;
			
		case 'Race History':
			document.getElementById('raceHistory').setAttribute('class', 'modalOptionActive');
			break;
			
		case 'Developer Team':
			document.getElementById('developerTeamInfo').setAttribute('class', 'modalOptionActive');
			break;
			
		case 'Simulator Information':
			document.getElementById('gameInfo').setAttribute('class', 'modalOptionActive');
			break;
			
		case 'Clean Indexed DB':
			document.getElementById('cleanIDB').setAttribute('class', 'modalOptionActive');
			break;
	}
}

// Function for individual history display
function showHistory(name) {
	document.getElementById('genericModalTitle').innerHTML = name;
	resetModal();
	
	// TO DO
}

// Modal body cleaning
function resetModal() {
	var elements = document.getElementsByClassName('modalOptionActive');
	
	for(var elem in elements)
	{
		try
		{
			elements[elem].setAttribute('class', 'modalOption');
		}
		catch(ex)
		{}
	}
}

// Activate or deactivate pass turn and history buttons  -> To be deleted?
function gamePlayingOptions(active) {
	
	if (active)
	{
		document.getElementById('turnPassBtn').removeAttribute('disabled');
		document.getElementById('raceHistoryBtn').removeAttribute('disabled');
	}
	else
	{
		document.getElementById('turnPassBtn').setAttribute('disabled', 'disabled');
		document.getElementById('raceHistoryBtn').setAttribute('disabled', 'disabled');
	}	
}

// Create teams from list (in div teamCreation)
function showTeams() {
	var actualInner = document.getElementById('teamCreation').innerHTML;
	var i, j;
	var teamImgName;
	
	for (i = 0; i < teamsName.length;)
	{
		actualInner += '<div class="row">';
		
		// Three is the amount of elements per row we want
		for (j = 0; j < 3; j++, i++)
		{
			teamImageName = teamsName[i].split(' ');
			teamImageName = teamImageName[0].toLowerCase();
			
			// The image of each time need to have a name that equals the first word of the team's complete name in lower case (ex: Movistar team -> image: movistar.jpg)
			actualInner += '<div class="col-md-4"> <img id="' + teamsName[i] + '" src="Resources/Images/'+ teamImageName +'.jpg" class="teamSelectImage center-block" onclick="deactivateTeam(\''+ teamsName[i] +'\')"/> </div>'
		}
		
		actualInner += '</div>';
	}
	
	document.getElementById('teamCreation').innerHTML = actualInner;
}

// Deactivate team choice and register it
function deactivateTeam(id) {
	var teamsDivs = document.getElementsByClassName('teamImageDisabled');
	
	for (var i in teamsDivs)
	{
		try
		{
			if (teamsDivs[i].id == id)
			{
				return;
			}
		}
		catch(ex)
		{}
	}
	
	document.getElementById(id).setAttribute('disabled', 'disabled');
	document.getElementById(id).setAttribute( 'class', 'teamSelectImage center-block teamImageDisabled');
	
	// Increase amount of players selected, create an array for the team and add it to the teams array
	playersSelected++;
	var teamArray = new Array();
	var memberArray;
	teamArray[0] = id;
	
	for (var i = 1; i <= membersAmount; i++)
	{
		// Create new array and define each index value
		memberArray = new Array();
		
		memberArray[0] = 'Member' + i;
		if (i == 1)
		{
			memberArray[1] = 'Team Leader';
		}
		else
		{
			memberArray[1] = 'Gregarious';
		}
		memberArray[2] = 0;
		memberArray[3] = 0;
		memberArray[4] = new Array(); // Member history
		
		teamArray.push(memberArray);
	}
	
	teams.push(teamArray);
}

// If a new game is created we have to activate again the teams
function activateTeams() {
	var teamsDivs = document.getElementsByClassName('teamSelectImage');
	
	for (var i in teamsDivs)
	{
		try
		{
			teamsDivs[i].removeAttribute('disabled');	
			teamsDivs[i].setAttribute('class', 'teamSelectImage center-block');
		}
		catch(ex)
		{}
	}
}

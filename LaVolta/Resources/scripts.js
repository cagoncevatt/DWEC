var race = {};
var teams = new Array();
var history = new Array();
var teamsName = new Array('Ag2r La Mondiale', 'Astana Pro Team', 'Blanco Pro Cycling Team', 'BMC Racing Team', 'Movistar Team', 'Saxo Tinkoff');
var totalTurns;
var membersAmount;
var maxPlayers = 2;
var playersSelected = 0;
var initAvailMpt = 1000;
var raceMaxMeters = 5000;
var shownTeamInd;

/*--------- templates ----- 
	 		  0      1            2               3              4
teamMember [name] [role] [maxMetersPerTurn] [metersMoved] [memberHistory]
----------------------------------------------------*/

// Progress and history Bar id -> teamName(lowerCase) + memberName(lowerCase) + Index + 'Progress' // In history there is a separation with '-' between words
//Ex:									movistarmarc1Progress
//Ex2:									movistar-marc-1-history


var teamMembersStartIndex = 2; // Team members will begin from index 2. Index 0 is for the team's name and Index 1 is for current meters to give.
var teamsStartIndex = 4; // Teams in race will start at index 2. Index 0 is for date and 1 is for name and 2 is for members amount per team

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
	
	// We save the game when they pass a turn or when they press the "Save" button
	$('#saveActualBtn').click(function(e) {
		saveToDb(race);
	});
	
	$('#turnPassBtn').click(function(e) {
		saveToDb(race);
	});
	
	$('#foodBagTooltip').tooltip();
	
	openDB();
	showTeams();
});

// Set race
function setRace(newRace) {
	race = newRace;
	history = race.gameHistory;
	// Set this new race teams the teams for actual race
	for (var i = 0; i < race.gameTeams.length; i++)
	{
		teams.push(race.gameTeams[i]);
	}
}

// If we need to define the players from another js we can use this function
function setPlayers(value)
{
	playersSelected = value;
}

// If we need to reset the teams from another resource
function resetTeams()
{
	teams = new Array();
}

// Obtain percent it has to move
function movePercent(value)
{
	var result;
	
	result = (value/raceMaxMeters)*100;
	
	return result;	
}


// Display a div from the modal body and change the title
function modalInfo(title) {
	document.getElementById('genericModalTitle').innerHTML = title;
	
	resetModal();
	
	// Using the title as reference we show a specific div
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
			
		case 'Delete Saved Data':
			document.getElementById('cleanIDB').setAttribute('class', 'modalOptionActive');
			break;
			
		
	}
}

// Like the previous function for another modal
function noCloseModalInfo(title)
{
	document.getElementById('genericNoCloseModalTitle').innerHTML = title;
	
	resetModal();
	
	switch(title)
	{
		case 'Create New Game':
			document.getElementById('gameInit').setAttribute('class', 'modalOptionActive');
			break;
			
		case 'Team Settings':
			document.getElementById('teamSettings').setAttribute('class', 'modalOptionActive');
			break;
	}
}

// Create the content of the team settings
function showTeamSettings(teamId) {
	var teamIndex = confirmTeam(teamId);
	
	if (teamIndex < 0)
		return;
		
	var newInner = "";
	shownTeamInd = teamIndex;
	var teamSeen = teams[teamIndex];
	
	for (var i = teamMembersStartIndex; i < teamSeen.length; i++)
	{
		newInner += '<div class="row"> <div class="col-md-6"> <p class="text-center">'+ (teamSeen[i])[0] +'</p> </div> <div class="col-md-6"> <div class="row"> <div class="col-md-2"> <span id="'+ (teamSeen[i])[0] +'lessMetersBtn" onclick="lessMeters(\'member'+ (teamSeen[i])[0] +'\')" class="glyphicon glyphicon-chevron-left metersArrow center-block"></span> </div> <div class="col-md-8"> <p id="member'+ (teamSeen[i])[0] +'" class="text-center memberMetersCont">'+ (teamSeen[i])[2] +'</p> </div> <div class="col-md-2"> <span id="'+ (teamSeen[i])[0] +'moreMetersBtn" onclick="moreMeters(\'member'+ (teamSeen[i])[0] +'\')" class="glyphicon glyphicon-chevron-right metersArrow center-block"></span> </div> </div> </div> </div>';
	}
	
	document.getElementById('mptValue').innerHTML = teamSeen[1];
	document.getElementById('membersSettingsCont').innerHTML = newInner;
}

// Confirm if the team is in the array
function confirmTeam(teamId) {
	var i;
	var found = false;
	
	for (i = 0; i < teamsName.length && !found; i++)
	{
		if ((teams[i])[0].toLowerCase() == teamId.toLowerCase())
			found = true;
	}
	
	if (found)
		return i-1;
	else
		return -1;
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

// Activate or deactivate pass turn and history buttons
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

// We use this function to activate or de-activate the Close option of the Team Settings only if the create phase has finished
function teamModalClose(active)
{
	if (active && playersSelected == maxPlayers)
	{
		document.getElementById('closeBtn').style.display = 'inline-block';	
	}
	else
	{
		document.getElementById('closeBtn').style.display = 'none';
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
			
			// The image of each team needs to have a name that equals the first word of the team's complete name in lower case (ex: Movistar team -> image: movistar.jpg)
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
	createTeam(id);
}

// Create a team with it members
function createTeam(id)
{
	var teamArray = new Array();
	var memberArray;
	teamArray[0] = id;
	teamArray[1] = initAvailMpt;
	
	for (var i = teamMembersStartIndex; i <= membersAmount; i++)
	{
		// Create new array and define each index value
		memberArray = new Array();
		
		memberArray[0] = 'Member' + (i-1);
		if (i == teamMembersStartIndex)
		{
			memberArray[1] = 'Team Leader';
		}
		else
		{
			memberArray[1] = 'Gregarious';
		}
		memberArray[2] = 0; // Meters per turn
		memberArray[3] = 0; // Meters moved
		memberArray[4] = new Array(); // Member history
		
		teamArray.push(memberArray);
	}
	
	teams.push(teamArray);
	createTeamElements(teamArray, false);
	comprovePlayers();
}


// Create elements for a team
function createTeamElements(team, load) {
	var actualInner = document.getElementById('teamsContainer').innerHTML;
	var teamName = team[0].split(' ');
	teamName = teamName[0].toLowerCase();
	var progressId;
	var teamName;
	var imageUrl;
	var imageId;
	
	actualInner += '<div class="row"> <!-- Team --> <div class="col-md-12 teamCont"> <div class="row"> <!-- Team logo, name and setting (meters for each member) --> <div class="col-md-1"> <img class="teamImage" src="Resources/Images/'+ teamName +'.jpg" alt="team_image" /> </div> <div class="col-md-4"> <h2 class="teamTitle">'+ team[0]+ '</h2> </div> <div class="col-md-7"> <img class="teamSettingsBtn" src="Resources/Images/settings-button.png" alt="teamSettings" data-toggle="modal" data-target="#genericNoCloseModalContainer" data-backdrop="false" data-keyboard="false" onclick="noCloseModalInfo(\'Team Settings\'); showTeamSettings(\''+ team[0] +'\')"/> </div> </div> <div class="racersCont"> <!-- Team members and progress --> ';

	for (var i = teamMembersStartIndex; i <= membersAmount; i++)
	{
		if ((team[i])[3] >= 95)
		{
			imageUrl = "finish";
		}	
		else
		{
			imageUrl = "cyclistImg";
		}
		
		teamName = team[0].replace(/\s+/g, '');
		progressId = teamName.toLowerCase() + (team[i])[0].toLowerCase() + i +'Progress';
		imageId = teamName.toLowerCase() + (team[i])[0].toLowerCase() + i +'Icon';
		actualInner += '<div class="row"> <div class="col-md-12"> <div class="row"> <!-- Name and position --> <div class="col-md-12"> <h4 class="memberName">'+ (team[i])[0] +', <small>'+ (team[i])[1] +'</small> </h4> </div> </div> <div class="row"> <!-- Progress and member history --> <div class="col-md-11"> <div class="memberProgressCont"> <div class="row"> <div class="col-md-12"> <div id="'+ progressId +'" class="memberProgress"></div> <img id="'+ imageId +'" class="memberImage" src="Resources/Images/'+ imageUrl +'.png" alt="team_member"/> </div> </div> </div> </div> <div class="col-md-1"> <img class="imageButtonHistory center-block" src="Resources/Images/historyIcon.png" alt="member_history" data-toggle="modal" data-target="#genericModalContainer" onclick="showHistory(\'' + team[0] + '-' + (team[i])[0] + '-' + i + '-' +'\')" /> </div> </div> </div> </div> ';
	}
			
	actualInner += '</div> </div> </div>';
	
	document.getElementById('teamsContainer').innerHTML = actualInner;
	
	if (load)
	{
		setTimeout("loadMembersStats()", 50);
	}
	else
	{
		noCloseModalInfo('Team Settings')
		$('#genericNoCloseModalContainer').modal({
		    keyboard: false,
		    backdrop: false,
		    show: true
		});
		showTeamSettings(team[0]);
	}
}


// Comprove if both players have chosen a team, can be extended for more players in the future
function comprovePlayers() {
	if (playersSelected == maxPlayers)
	{
		dbAddInfo(race);
		$('#menuContLeft a[href="#raceControl"]').tab('show');
		gamePlayingOptions(true);
	}
}

// Create the game, restarting variables
function createGame() {
	teams = new Array();
	history = new Array();
	playersSelected = 0;
	setMembersAmount(parseInt($('#membAmount').val()) + 1);
	teamModalClose(false);
	
	var nameCont = document.getElementById('gameNameText');
	var name;
	
	if (nameCont.value.length < 3)
	{
		// Possibilities to get the same number than the one of another saved race?
		name = "defaultGame" + (Math.floor(Math.random()*1000) / Math.floor(Math.random()*250) * Math.floor(Math.random()*50));
	}
	else
	{
		name = nameCont.value;
	}
	
	// If we want to allow more players we would add a new value like "gamePlayers"
	race = {
		gameDate: new Date(),
		gameName: name,
		gameMembers: membersAmount,
		gameHistory: history,
		gameTeams: teams
	};	
}

// Assign members amount
function setMembersAmount(num)
{
	membersAmount = num;
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
	
	// Also we have to clean the teamsContainer
	document.getElementById('teamsContainer').innerHTML = '';
	$('#menuContLeft a[href="#teamCreation"]').tab('show');
}

// Listing of races available to load
function racesToLoad(races, load) {
	var inner;
	
	var onclickFunc;
	var elemId;
	
	if (load)
	{
		elemId = 'loadRaceList';
		inner = '<small>Click on one race to load it\'s content.</small>'
	}
	else
	{
		// A control for missclick should be implemented
		elemId = 'loadDeleteRaceList';
		inner = '<small>Click on one race to delete it, be careful because if you click it, the race will be entirely removed.</small>'
	}
	
	for (var i in races)
	{
		if (load)
		{
			onclickFunc = 'loadRace(\''+ races[i].gameName +'\')';
		}
		else
		{
			onclickFunc = 'deleteRace(\''+ races[i].gameName +'\')';
		}
		
		inner += '<p class="raceListItem" onclick="'+ onclickFunc +'"><strong>Race Date: '+ races[i].gameDate.getDate() +'/' + (races[i].gameDate.getMonth()+1) + '/' + races[i].gameDate.getFullYear() +' - Hour: '+ races[i].gameDate.getHours() +':'+ races[i].gameDate.getMinutes() +':'+ races[i].gameDate.getSeconds() +'</strong></p>';
	}
	
	document.getElementById(elemId).innerHTML = inner;
}

// Give more meters to a member
function moreMeters(memberId) {
	var totalMet = parseInt(document.getElementById('mptValue').innerHTML);
	var memberSpeed = parseInt(document.getElementById(memberId).innerHTML);
	
	if (totalMet > 0)
	{
		memberSpeed += 100;
		totalMet -= 100;
		
		document.getElementById('mptValue').innerHTML = totalMet;
		document.getElementById(memberId).innerHTML = memberSpeed;
	}
}

// Take out meters from a member
function lessMeters(memberId) {
	var totalMet = parseInt(document.getElementById('mptValue').innerHTML);
	var memberSpeed = parseInt(document.getElementById(memberId).innerHTML);
	
	if (memberSpeed > 0)
	{
		memberSpeed -= 100;
		totalMet += 100;
		
		document.getElementById('mptValue').innerHTML = totalMet;
		document.getElementById(memberId).innerHTML = memberSpeed;
	}
}

// Save meters
function saveMeters()
{
	var totalMet = parseInt(document.getElementById('mptValue').innerHTML);
	var memberSpeed;
	var memberId;
	var teamSeen = teams[shownTeamInd];
	
	teamSeen[1] = totalMet;
	
	for (var i = teamMembersStartIndex; i < teamSeen.length; i++)
	{
		memberId = 'member'+(teamSeen[i])[0];
		memberSpeed = parseInt(document.getElementById(memberId).innerHTML);
		
		(teamSeen[i])[2] = memberSpeed;
	}
}

// Turn pass, moving the team members the amount of meters the have assigend
function turnPass()
{
	var team;
	var progressValue;
	var toAdvance;
	var memberId;
	
	for (var i in race)
	{
		if (i == "gameTeams")
		{
			teams = race[i];
			
			for (var j = 0; j < teams.length; j++)
			{
				team = teams[j];
				
				for (var n = teamMembersStartIndex; n < team.length; n++)
				{	
					toAdvance = movePercent((team[n])[2]);
					teamName = team[0].replace(/\s+/g, '');
					progressId = '#'+ teamName.toLowerCase() + (team[n])[0].toLowerCase() + n +'Progress';
					(team[n])[3] += toAdvance;
					
					if ((team[n])[3] >= 95)
					{
						(team[n])[3] = 95;
						progressValue = (team[n])[3]+'%';
						
						if (!comproveGoal((team[n])[0], team[0]))
						{
							raceHistorySave((team[n])[0], team[0]);
							memberWin(teamName.toLowerCase() + (team[n])[0].toLowerCase() + n +'Icon');
						}
					}
					else
					{
						progressValue = (team[n])[3]+'%';
					}
					
					if (!comproveGoal((team[n])[0], team[0]))
					{
						memberHistorySave(team[n]);
					}
					
					$(progressId).animate({width:progressValue}, {queue:false});
				}
			}
		}
	}
}

// Comprove if the member has already won
function comproveGoal(member, team)
{
	for (var i = 0; i < history.length; i++)
	{
		if ((history[i])[0] == member && (history[i])[1] == team)
		{
			return true;
		}
	}
	
	return false;
}

// Load members stats
function loadMembersStats() {
	var team;
	var progressId;
	var progressValue;
	var teamName;
	
	for (var i in race)
	{
		if (i == "gameTeams")
		{
			teams = race[i];
			
			for (var j = 0; j < teams.length; j++)
			{
				team = teams[j];
				
				for (var n = teamMembersStartIndex; n < team.length; n++)
				{	
					teamName = team[0].replace(/\s+/g, '');
					progressId = teamName.toLowerCase() + (team[n])[0].toLowerCase() + n +'Progress';
					progressValue = (team[n])[3];
					
					document.getElementById(progressId).style.width = progressValue+"%";
				}
			}
		}	
	}
}

// Race History saving -> will store the members in the order that they reach the goal
function raceHistorySave(member, team)
{
	var arrayVar = new Array();
	arrayVar.push(member);
	arrayVar.push(team);
	history.push(arrayVar);	
}

// Member History Save
function memberHistorySave(member)
{
	member[4].push(member[2]);
}

// Function for individual history display
function showHistory(memberId) {
	var splitted = memberId.split('-');
	var inner = "";
	var members;
	var teams;
	var team;
	
	document.getElementById('genericModalTitle').innerHTML = splitted[0] + '\'s ' + splitted[1] + ' Race History';
	resetModal();
	
	for (var i in race)
	{
		if (i == "gameTeams")
		{
			teams = race[i];
			
			for (var j = 0; j < teams.length; j++)
			{
				team = teams[j];

				if (team[0] == splitted[0])
				{
					for (var i = teamMembersStartIndex; i < team.length; i++)
					{
						members = team[i];
					
						if (members[0] == splitted[1])
						{
							for(var l = 0; l < members[4].length; l++)
							{
								inner += '<div class="row"> <div class="col-md-6"> <p class="text-center">Turn '+ (l+1) +':</p> </div> <div class="col-md-6"> <p class="text-center memberMetersCont">'+ (members[4])[l] +'</p> </div> </div>';
							}
						}
					}
				}
			}
		}
	}
	
	document.getElementById('memberHistory').innerHTML = inner;
	document.getElementById('memberHistory').setAttribute('class', 'modalOptionActive');	
}

// Display race history elements
function showRaceHistory()
{
	var inner = "";
	
	for (var i = 0; i < history.length; i++)
	{
		inner += '<div class="row"> <div class="col-md-12"> <p class="text-center"><strong>'+ (i+1) +'</strong>º ' + (history[i])[0] + ' from ' + (history[i])[1] +'</p> </div> </div>';
	}
	
	document.getElementById('raceHistory').innerHTML = inner;
}

// Change member image for a goal flag once they win
function memberWin(id)
{
	document.getElementById(id).setAttribute('src', 'Resources/Images/finish.png');
}

//Main info: http://net.tutsplus.com/tutorials/javascript-ajax/working-with-indexeddb/
//More: https://developer.mozilla.org/es/docs/IndexedDB/Using_IndexedDB

/*
Array Partida(gameName -> (name + date)) -> [team [runner [role] [maxMetersPerTurn] [metersMoved] [history [turn1] [turn2] [turn3] [etc]]] [runner [etc]] [team [runner [etc]]] ] 

*  ^ Maybe only date*/

var idbSupported = false;
var voltaDB;

$(document).ready(function(){
    if("indexedDB" in window) {
        idbSupported = true;
    }
    else
    {
    	alert("Your Web Broswe does not support IndexedDB, this can lead to errors and the disabling of the load/saving function");
    }
},false);

// Open database if indexedDB is supported
function openDB() {
	if (idbSupported)
	{
		var openRequest = indexedDB.open("laVolta",2);
 
        openRequest.onupgradeneeded = function(e) {
            var actualDB = e.target.result;
            
            if(!actualDB.objectStoreNames.contains("laVolta"))
            {
            	var store = actualDB.createObjectStore("laVolta", { keyPath: "gameDate" });
            	store.createIndex("gameName", "gameName", { unique:true });
            }
        }
 
        openRequest.onsuccess = function(e) {
            voltaDB = e.target.result;
            
            voltaDB.onerror = function(event) {
			  // Generic error handler for all errors targeted at this database's
			  // requests!
			  alert("Database error: " + event.target.errorCode);
			};
        }
 
        openRequest.onerror = function(e) {
            console.dir(e);
        }
	}
}




function dbAddInfo(data) {
	
	//------------------------
	var transaction = voltaDB.transaction(["laVolta"], "readwrite");
	var store = transaction.objectStore("laVolta");
	
	var request = store.put(data);
	
	request.onerror = function(e) {
        console.log("Error",e.target.error.name);
        
    }
 
    request.onsuccess = function(e) {
        
    }
}


function saveToDb(data) {
	var transaction = voltaDB.transaction(["laVolta"], "readwrite");
	var store = transaction.objectStore("laVolta");
	
	var request = store.delete(data.gameDate);
	
	data.gameDate = new Date();
	
	request.onsuccess = function(event) {
		dbAddInfo(data);
	};
}



function loadRace(gameName) {
	var req = voltaDB.transaction(["laVolta"]).objectStore("laVolta").index("gameName");
	
	req.get(gameName).onsuccess = function(event) {
		var data = event.target.result;
		resetTeams();
		setRace(data);
		document.getElementById('teamsContainer').innerHTML = '';
		gamePlayingOptions(true);
		setMembersAmount(data.gameMembers);
		
		for(var i in data.gameTeams)
		{
			createTeamElements(data.gameTeams[i], true);
		}
		
		// Players is actual max amount of players, in a future this value should be a variable from the race (gamePlayers)
		setPlayers(2);
		teamModalClose(true);
		
		$('#startRaceBtn a[href="#gameCont"]').tab('show');
		$('#menuContLeft a[href="#raceControl"]').tab('show');	
	};
}

function getAllData(load) {
	var transaction = voltaDB.transaction(["laVolta"], "readwrite");
	var store = transaction.objectStore("laVolta");
	var races = [];

	store.openCursor().onsuccess = function(event) {
	  var cursor = event.target.result;
	  if (cursor) {
	    races.push(cursor.value);
	    cursor.continue();
	  }
	  else {
	    racesToLoad(races, load);
	  }
	};
}


function deleteRace(gameName) {
	var req = voltaDB.transaction(["laVolta"]).objectStore("laVolta").index("gameName");
	
	req.get(gameName).onsuccess = function(event) {
		var data = event.target.result;
		
		var req = voltaDB.transaction(["laVolta"], "readwrite").objectStore("laVolta").delete(data.gameDate);
	
		req.onsuccess = function(event) {
			getAllData(false);
		};
	};
	
	
}

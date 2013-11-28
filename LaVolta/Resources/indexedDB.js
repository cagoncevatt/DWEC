//Main info: http://net.tutsplus.com/tutorials/javascript-ajax/working-with-indexeddb/
//More: https://developer.mozilla.org/es/docs/IndexedDB/Using_IndexedDB

/*
Array Partida(gameName -> (name + date)) -> [team [runner [role] [maxMetersPerTurn] [metersMoved] [history [turn1] [turn2] [turn3] [etc]]] [runner [etc]] [team [runner [etc]]] ] 

*  ^ Maybe only date*/

var idbSupported = false;
var voltaDB;

document.addEventListener("DOMContentLoaded", function(){
    if("indexedDB" in window) {
        idbSupported = true;
    }
},false);

// Open database if indexedDB is supported
function openDB() {
	if (idbSupported)
	{
		var openRequest = indexedDB.open("laVolta",1);
 
        openRequest.onupgradeneeded = function(e) {
            var actualDB = e.target.result;
            
            if(!actualDB.objectStoreNames.contains("laVolta"))
            {
            	var store = actualDB.createObjectStore("laVolta", { keyPath: "gameName" });
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
	
	//---- temporal add element -> using put to overwrite info, because add doesn't do it
	var request = store.put(data);
	
	request.onerror = function(e) {
        console.log("Error",e.target.error.name);
        //some type of error handler
    }
 
    request.onsuccess = function(e) {
        console.log("Information registed.");
    }
}




function loadData(store) {
	voltaDB.transaction("laVolta").objectStore(store).get(key/*the keypath that can be the name of the player or other things*/).onsuccess = function(event) {
		console.log("Data loaded successfully");
	};
}

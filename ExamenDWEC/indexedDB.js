var valuesArray = new Array();
var db;

function guardaAArray(value) {
	valuesArray.push(value);
	var transaction = db.transaction(["number"], "readwrite");
	var objectStore = transaction.objectStore("number");
	
	var request = objectStore.add(value);
}

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
if (!window.indexedDB) {
     window.alert("Your browser doesn't support a stable version of IndexedDB.");
}
var request = indexedDB.open("generatedNumbers",1);
request.onerror = function(event) {
  	console.log("An error has ocurred with IndexedDB");
};
request.onsuccess = function(event) {
  	db = request.result;
  	db.onerror = function(event) {
	  	alert("Database error: " + event.target.errorCode);
	};
};

request.onupgradeneeded = function(event) { 
  var db = event.target.result;

  var objectStore = db.createObjectStore("number", { autoIncrement: true });
};
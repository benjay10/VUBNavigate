"use strict";

function DatabaseService() {

	// Fields
	
	this.files = {
		meta: "assets/databaseMeta.json",
		buildings: "assets/buildings.json",
		rooms: "assets/rooms.json",
		edges: "assets/edges.json"
	}
	this.database = null;
	
	// Methods
	
	this.getJson = function(url) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("GET", url, true);
			xhr.responseType = "json";
			xhr.timeout = 5000;
			xhr.onreadystatechange = function () {
				if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
					resolve(xhr.response);
				}
				else if (xhr.readyState === XMLHttpRequest.DONE) {
					reject(xhr.status);
				}
			};
			xhr.send();
		});
	};
	
	// Database stuff
	
	this.startDatabase = function () {
		let me = this;
		this.getJson(this.files.meta).then((meta) => {
			//TODO: do this inside a new promise to be able to resolve and REJECT?
			console.log("Database creation started");
			let db = null;
			let dbrequest = indexedDB.open("VUBNavigate", meta.version);
			dbrequest.onsuccess = (event) => {
				me.database = event.target.result;
				db = event.target.result;
				console.log("It worked");
			};
			dbrequest.onerror = (event) => {
				console.log(event);
			};
			console.log(dbrequest);
			return [ meta, db ]; 
		});
	};

	// Init
	
	this.init = function () {
		//window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
		//window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};
		//window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

		this.startDatabase();
	};

}


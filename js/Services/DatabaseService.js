"use strict";

function DatabaseService() {

	// Fields
	
	this.files = {
		meta: "assets/databaseMeta.json",
		buildings: "assets/buildings.json",
		rooms: "assets/rooms2.json",
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
		return this.getJson(this.files.meta).then((meta) => {
			return new Promise((resolve, reject) => {
				console.log("Database creation started");
				// dbrequest :: IDBOpenDBRequest (<- IDBRequest <- EventTarget)
				let dbrequest = indexedDB.open("VUBNavigate", meta.version);
				dbrequest.onsuccess = (event) => {
					resolve(event.target.result);
				};
				dbrequest.onerror = (event) => {
					reject(event);
				};
				dbrequest.onupgradeneeded = (event) => {
					console.log("An upgrade to the database is needed");
					me.initialiseDatabase(event.target.result, event.oldVersion, event.newVersion);
				};
			});
		})
		.then((db) => {
			me.database = db;
			console.log("Database creation success");
			return db;
		})
		.then((db) => {
			//	Events bubble, this is the top for the error events.
			console.log("Now putting an error event listener on the database");
			db.onerror = (event) => {
				// General error on the database or a transaction
				console.error(event);
			};
		})
		.catch((error) => {
			console.error("Database creation error! Try clearing browser history with the HTML5 storage in particular, and try again.", error);
		});
	};

	this.initialiseDatabase = function (db, oldVersion, newVersion) {
		let me = this;
		let dbcreate = new Promise((resolve, reject) => {
			
			// Delete older versions of the data
			if (oldVersion > 0) {
				console.log("Old version of the database detected.");
				db.deleteObjectStore("rooms");
			}

			// Create the new room data
			let roomStore = db.createObjectStore("rooms", { keyPath: "id" });
			console.log("Object store created, now starting with indexes.");
			roomStore.createIndex("legalName", "legalName", { unique: false });
			roomStore.createIndex("uniformName", "uniformName", { unique: false });
			roomStore.createIndex("building", "building", { unique: false });
			roomStore.createIndex("floor", "floor", { unique: false });
			roomStore.createIndex("type", "type", { unique: false });
			
			roomStore.transaction.oncomplete = (event) => {
				console.log("Objectstore fully created");
				resolve(db);
			};
			roomStore.transaction.onerror = (event) => {
				reject(db);
			};
		});
		let roomretreive = me.getJson(me.files.rooms);

		return Promise.all([dbcreate, roomretreive]).then((values) => {
			let db = values[0];
			console.log("Start creating a transaction");
			let roomStoreTransaction = db.transaction("rooms", "readwrite").objectStore("rooms");
			console.log("Transaction created");
			let roomdata = values[1];

			roomdata.rooms.forEach((room, index) => {
				console.log("Putting object in the database");
				roomStoreTransaction.add(room);
			});
		})
		.catch((error) => {
			console.error("Initialisation of the database failed.", error);
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


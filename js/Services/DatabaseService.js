"use strict";

function DatabaseService() {

	// Fields
	
	this.files = {
		meta: "assets/databaseMeta.json",
		buildings: "assets/buildings.json",
		rooms: "assets/rooms2.json",
		walks: "assets/walks.json"
	}
	this.database = null;

	// Important API methods
	
	this.getRoom = function(roomId) {
		let me = this;
		return new Promise((resolve, reject) => {
			let transaction = me.database.transaction(["rooms"], "readonly");
			let objectStore = transaction.objectStore("rooms");
			let request = objectStore.get(roomId);
			request.onerror = (event) => reject(event);
			request.onsuccess = (event) => { 
				// Still need to make a distinction here, because even if the object is not found, the request is succesful
				if (event.target.result) {
					resolve(event.target.result);
				} else {
					reject("The room with ID '" + roomId + "' does not exist in the database.");
				}
			};
		});
	};

	this.searchRooms = function(searchString) {
		let me = this;
		return new Promise((resolve, reject) => {
			let results = [];
			searchString = searchString.toLowerCase();
			let predicate = (room) => {
				return (
					((room.legalName && room.legalName.toLowerCase().includes(searchString)) ||
					(room.uniformName && room.uniformName.toLowerCase().includes(searchString))) //&&  // Uncomment the following for a more natural search
					//(room.type && (room.type.includes("classroom") ||
					//			   room.type.includes("office") ||
					//			   room.type.includes("study room") ||
					//			   room.type.includes("meeting room") ||
					//			   room.type.includes("laboratory") ||
					//			   room.type.includes("dining room") ||
					//			   room.type.includes("library")))
				);
			};

			let transaction = me.database.transaction(["rooms"], "readonly");
			let objectStore = transaction.objectStore("rooms");
			let cursor = objectStore.openCursor();
			cursor.onerror = (error) => reject(error);
			cursor.onsuccess = (event) => {
				let cursor = event.target.result;
				if (cursor) {
					let room = cursor.value;
					if (predicate(room)) {
						results.push(room);
					}
					cursor.continue();
				} else {
					if (results.length > 0) {
						resolve(results);
					} else {
						reject("No results found for search with text \"" + searchString + "\".");
					}
				}
			};
		});
	};

	this.getBuilding = function(name) {
		let me = this;
		return new Promise((resolve, reject) => {
			let transaction = me.database.transaction(["buildings"], "readonly");
			let objectStore = transaction.objectStore("buildings");
			let request = objectStore.get(name.toUpperCase());
			request.onerror = (event) => reject(event);
			request.onsuccess = (event) => { 
				// Still need to make a distinction here, because even if the object is not found, the request is succesful
				if (event.target.result) {
					resolve(event.target.result);
				} else {
					reject("The building with name '" + name + "' does not exist in the database.");
				}
			};
		});
	};

	this.getRoomsInBuildingFloor = function(buildingName, floorNumber) {
		let me = this;
		return new Promise((resolve, reject) => {
			let results = [];
			buildingName = buildingName.toUpperCase();

			let transaction = me.database.transaction(["rooms"], "readonly");
			let roomStore = transaction.objectStore("rooms");
			let buildingIndex = roomStore.index("building");
			let buildingRange = IDBKeyRange.only(buildingName);
			let buildingCursor = buildingIndex.openCursor(buildingRange);
			buildingCursor.onerror = (error) => reject(error);
			buildingCursor.onsuccess = (event) => {
				let cursor = event.target.result;
				if (cursor) {
					let room = cursor.value;
					if (room.floor == floorNumber) {
						results.push(room);
					}
					cursor.continue();
				} else {
					if (results.length > 1) {
						resolve(results);
					} else {
						reject("No results found for the combination of building '" + buildingName + "' and floor '" + floorNumber.toString() + "'.");
					}
				}
			};
		});
	};
	
	this.getWalks = function () {
		let me = this;
		return new Promise((resolve, reject) => {
			let walks = [];
			
			let transaction = me.database.transaction(["walks"], "readonly");
			let walkstore = transaction.objectStore("walks");
			let request = walkstore.getAll();

			request.onerror = (error) => reject(error);
			request.onsuccess = (event) => {
				if (event.target.result && event.target.result.length > 0) {
					resolve(event.target.result);
				} else {
					reject("No walks found in the database. Something must be wrong then.");
				}
			};
		});
	};
	
	// Extra methods
	
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
			//console.log("Now putting an error event listener on the database");
			db.onerror = (event) => {
				// General error on the database or a transaction
				console.error("Performing an action on the database resulted in an error.", event);
			};
		})
		.catch((error) => {
			console.error("Database creation error! Try clearing browser history with the HTML5 storage in particular, and try again.", error);
		});
	};

	this.createSchema = function (db, oldVersion, newVersion) {
		return new Promise((resolve, reject) => {

			// Delete older versions of the data
			if (oldVersion > 0) {
				db.deleteObjectStore("rooms");
				db.deleteObjectStore("buildings");
				db.deleteObjectStore("walks");
			}

			// Create the new room schema
			let roomStore = db.createObjectStore("rooms", { keyPath: "id" });
			roomStore.createIndex("legalName", "legalName", { unique: false });
			roomStore.createIndex("uniformName", "uniformName", { unique: false });
			roomStore.createIndex("building", "building", { unique: false });
			roomStore.createIndex("floor", "floor", { unique: false });
			roomStore.createIndex("type", "type", { unique: false });
			
			// Create the new building schema
			let buildingStore = db.createObjectStore("buildings", { keyPath: "name" });

			// Create the schema for storing walks between rooms
			let walkStore = db.createObjectStore("walks", { keyPath: "id", autoIncrement: true });
			walkStore.createIndex("from", "from", { unique : false });
			walkStore.createIndex("to", "to", { unique : false });
			
			roomStore.transaction.onabort = (event) => {
				reject(event);
			};
			roomStore.transaction.oncomplete = (event) => {
				resolve(db);
			};
			roomStore.transaction.onerror = (event) => {
				reject(db);
			};
		});
	};

	this.initialiseDatabase = function (db, oldVersion, newVersion) {
		let me = this;
		let schemaCreate = me.createSchema(db, oldVersion, newVersion);
		let roomRetreive = me.getJson(me.files.rooms);
		let buildingRetreive = me.getJson(me.files.buildings);
		let walkRetreive = me.getJson(me.files.walks);

		let roomPopulate = Promise.all([schemaCreate, roomRetreive]).then((values) => {
			let db = values[0];
			let roomdata = values[1];
			let roomStoreTransaction = db.transaction(["rooms"], "readwrite");
			let roomStore = roomStoreTransaction.objectStore("rooms");

			roomdata.rooms.forEach((room, index) => {
				/*let request =*/ roomStore.add(room);
			});
			return db;
		});

		let buildingPopulate = Promise.all([schemaCreate, buildingRetreive]).then((values) => {
			let db = values[0];
			let buildingdata = values[1];
			let buildingStoreTransaction = db.transaction(["buildings"], "readwrite");
			let buildingStore = buildingStoreTransaction.objectStore("buildings");

			buildingdata.buildings.forEach((building, index) => {
				/*let request =*/ buildingStore.add(building);
			});
			return db;
		});
		
		let walkPopulate = Promise.all([schemaCreate, walkRetreive]).then((values) => {
			let db = values[0];
			let walkdata = values[1];
			let walkStoreTransaction = db.transaction(["walks"], "readwrite");
			let walkStore = walkStoreTransaction.objectStore("walks");

			walkdata.walks.forEach((walk, index) => {
				/*let request =*/ walkStore.add(walk);
			});
		});

		return Promise.all([roomPopulate, buildingPopulate, walkPopulate]).then((values) => { return values[0]; });
		//return Promise.all([roomPopulate]).then((values) => { return values[0]; });
	};

	// Init
	
	this.init = function () {
		//window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
		//window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};
		//window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

		return new Promise((resolve, reject) => {
			this.startDatabase();
		});
	};

}


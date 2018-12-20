"use strict";

function RoomService2(databaseService) {

	// Fields
	
	let me = this;
	
	// Methods
	
	// This adapted method return safely parsed room, no field is left undefined (this is possible in the DB)
	this.searchRooms = function (searchString, maxResultCount = 10) {
		//return databaseService.searchRooms(searchString);
		return databaseService.searchRooms(searchString).then(this.parseRooms);
	};

	this.getRoom = function (roomId) {
		return databaseService.getRoom(roomId).then(me.parseRoom);
	};

	this.getRoomsInBuildingFloor = function (building, floor) {
		//return databaseService.getRoomsInBuildingFloor(building, floor);
		return databaseService.getRoomsInBuildingFloor(building, floor).then(me.parseRooms);
	};

	this.getBuilding = function (buildingName) {
		return databaseService.getBuilding(buildingName);
	};

	this.getAllWalks = function () {
		return databaseService.getWalks().then(this.parseWalks);
	};
	this.getAllWalksForGraph = function () {
		return databaseService.getWalks().then(this.parseWalksForGraph);
	};

	// Parsing
	
	this.parseRoom = function (roomResult) {
		return me.parseRooms([roomResult]).then((rooms) => rooms[0]);
	};
	
	this.parseRooms = function (roomResults) {
		return new Promise((resolve, reject) => {
			let rooms = [];
			roomResults.forEach((room, index) => {
				let temproom = new Room();
				temproom.id = room.id;
				// Provide as much detail as possible to fill up as many fields as possible
				temproom.legalName = (room.legalName || room.uniformName || "");
				temproom.uniformName = (room.uniformName || room.legalName || "");
				temproom.building = (room.building || "");
				temproom.floor = (room.floor || 0);
				temproom.outsideAvailable = (room.outsideAvailable || []);
				temproom.type = (room.type || "");
				temproom.info = (room.info || "");
				rooms.push(temproom);
			});
			resolve(rooms);
		});
	};

	this.parseWalks = function (walkResults) {
		return new Promise((resolve, reject) => {
			let walks = [];

			walkResults.forEach((walk, index) => {
				let tempwalk = new Walk();
				tempwalk.id = walk.id;
				tempwalk.from = (walk.from || 0);
				tempwalk.to = (walk.to || 0);
				tempwalk.type = (walk.type || "");
				tempwalk.info = (walk.info || "");
				walks.push(tempwalk);
			});

			resolve(walks);
		});
	};

	this.parseWalksForGraph = function (walkResults) {
		return new Promise((resolve, reject) => {
			let walks = [];

			walkResults.forEach((walk, index) => {
				let cost = 0;
				switch (walk.type) {
					case "corridor":
						cost = 1;
						break;
					case "stairs":
						cost = 4;
						break;
					case "outside path":
						cost = 5;
						break;
					case "lift":
						cost = 3;
						break;
					default:
						cost = 1;
						break;
				}
				let tempwalk = {
					to: (walk.to || 0),
					from: (walk.from || 0),
					weight: cost, 
					type: (walk.type || ""),
					info: (walk.info || "")
				};
				walks.push(tempwalk);
			});

			resolve(walks);
		});
	};

	// Init
	
	this.init = function () {
		return; //Nothing to do, so skipping this function
		return new Promise((resolve, reject) => {

		});
	};
}


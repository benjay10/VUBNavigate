"use strict";

function RoomService2(databaseService) {

	// Fields
	
	// Methods
	
	// This adapted method return safely parsed room, no field is left undefined (this is possible in the DB)
	this.searchRooms = function (searchString, maxResultCount = 10) {
		//return databaseService.searchRooms(searchString);
		return databaseService.searchRooms(searchString).then(this.parseRooms);
	};

	this.getRoom = function (roomId) {
		return databaseService.getRoom(roomId).then(this.parseRoom);
	};

	this.getRoomsInBuildingFloor = function (building, floor) {
		//return databaseService.getRoomsInBuildingFloor(building, floor);
		return databaseService.getRoomsInBuildingFloor(building, floor).then(this.parseRooms);
	};

	this.getBuilding = function (buildingName) {
		return databaseService.getBuilding(buildingName);
	};

	// Parsing
	
	this.parseRoom = function (roomResult) {
		return this.parseRooms([roomResult]).then((rooms) => rooms[0]);
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

	// Init
	
	this.init = function () {
		return; //Nothing to do, so skipping this function
		return new Promise((resolve, reject) => {

		});
	};
}


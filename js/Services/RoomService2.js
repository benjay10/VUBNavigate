"use strict";

function RoomService2(databaseService) {

	// Fields
	
	// Methods
	
	this.searchRooms = function (searchString, maxResultCount = 10) {
		return databaseService.searchRooms(searchString);
	};

	this.getRoomsInBuildingFloor = function (building, floor) {
		return databaseService.getRoomsInBuildingFloor(building, floor);
	};

	this.getBuilding = function (buildingName) {
		return databaseService.getBuilding(buildingName);
	};

	// Init
	
	this.init = function () {
		return new Promise((resolve, reject) => {

		});
	};
}


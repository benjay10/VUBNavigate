"use strict";

function RoomService2() {

	// Fields
	
	// Methods
	
	this.searchRooms = function (searchString, maxResultCount = 10) {
		let me = this;
		return new Promise((resolve, reject) => {
			let rooms = [];
			for(let i = 0; i < maxResultCount; i++) {
				rooms.push(new Room(i, searchString + i, searchString + i, 4, "R"));
			}
			resolve(rooms);
		});
	};

	// Init
	
	this.init = function () {
		return new Promise((resolve, reject) => {

		});
	};
}


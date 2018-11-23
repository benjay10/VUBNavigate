"use strict";

function RoomService() {

	this.searchRooms2 = function (searchString, maxCount) {
		let rooms = [];
		for (let i = 0; i < 5; i++) {
			rooms.push(new Room(i, "R." + i, "xR" + i, 4, "R"));
		}
		return rooms;
	};

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

}


"use strict";

function RoomService() {

	this.searchRooms = function (searchString) {
		let rooms = [];
		for (let i = 0; i < 5; i++) {
			rooms.push(new Room(i, "R." + i, "xR" + i, 4, "R"));
		}
		return rooms;
	};

}


"use strict";

function RoomService() {

	// Fields
	
	// Will this ever work when you can not wait for a response? You send a request and some time, a message receive event will come back, but how do you link the message to the original request?
	this.dbWorker = null;
	this.dbWorkerFile = "js/Services/VubnDB.js";
	this.activeRequests = [];
	this.activeRequestUid = 1;

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

	this.testSearchSomething = function () {
		return new Promise((resolve, reject) => {
			let newUid = ++this.activeRequestUid;
			this.dbWorker.postMessage([newUid, "getSomething", "zoekstring"]);
			this.activeRequests.push([newUid, (data) => resolve(data), (error) => reject(error)]);
		});
	};

	this.testResponse = function (event, me) {
		return new Promise((resolve, reject) => {
			for (let i = 0; i < me.activeRequests.length; i++) {
				if (me.activeRequests[i][0] === event.data[0]) {
					me.activeRequests[i][1](event.data[1]);
					me.activeRequests.splice(i, 1);
					break;
				}
			}
		});
	};

	this.testError = function (event, me) {
		return new Promise((resolve, reject) => {
			for (let i = 0; i < me.activeRequests.length; i++) {
				if (me.activeRequests[i][0] === event.data[0]) {
					me.activeRequests[i][2](event.data[1]);
					me.activeRequests.splice(i, 1);
					break;
				}
			}
		});
	};

	// Init
	
	this.init = function () {
		return new Promise((resolve, reject) => {
			this.dbWorker = new Worker(this.dbWorkerFile);
			this.dbWorker.addEventListener("message", (event) => this.testResponse(event, this));
			this.dbWorker.addEventListener("error", (event) => console.log(event));

			// Start a test
			this.testSearchSomething().then((data) => console.log(data));
		});
	};
}


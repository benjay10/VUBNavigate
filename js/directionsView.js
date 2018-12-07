"use strict";

function DirectionsView(isTouch, roomService, navigateView) {

	// Fields and definitions
	
	let me = this;

	this.classDefinitions = {
		startNavigationButtons: "vubn-navigate-start",
		stopNavigationButtons: "vubn-navigate-stop",
		myLocationTexts: "vubn-navigate-mylocation",
		destinationTexts: "vubn-navigate-destination"
	};

	this.idDefinitions = {
	};

	this.clickEvent = (isTouch ? "touchend" : "click");

	// Dom Object

	this.startNavigationButtons = null;
	this.stopNavigationButtons = null;
	this.myLocationTexts = null;
	this.destinationTexts = null;
	
	// Methods
	
	this.onStartNavigation = function (event) {
		event.stopPropagation();
		let roomId = navigateView.selectedRoomId;
		
		return roomService.getRoom(roomId).then((room) => {
			// Set the destination fields
			me.destinationTexts.forEach((element, index) => {
				element.innerHTML = room.legalName;
			});
			return room;
		})
		.catch(console.error);
	};

	this.onStopNavigation = function (event) {
		event.stopPropagation();
		alert("The navigation will stop");
	};

	// Init
	
	this.init = function () {
		return new Promise((resolve, reject) => {
			
			// Search
			
			this.stopNavigationButtons = document.getElementsByClassName(this.classDefinitions.stopNavigationButtons);
			this.stopNavigationButtons = [].slice.call(this.stopNavigationButtons);
			this.startNavigationButtons = document.getElementsByClassName(this.classDefinitions.startNavigationButtons);
			this.startNavigationButtons = [].slice.call(this.startNavigationButtons);
			this.myLocationTexts = document.getElementsByClassName(this.classDefinitions.myLocationTexts);
			this.myLocationTexts = [].slice.call(this.myLocationTexts);
			this.destinationTexts = document.getElementsByClassName(this.classDefinitions.destinationTexts);
			this.destinationTexts = [].slice.call(this.destinationTexts);

			// Add listeners
			
			this.stopNavigationButtons.forEach((button, index) => {
				button.addEventListener(this.clickEvent, this.onStopNavigation);
			});

			this.startNavigationButtons.forEach((button, index) => {
				button.addEventListener(this.clickEvent, this.onStartNavigation);
			});

			resolve();
		});
	};
}

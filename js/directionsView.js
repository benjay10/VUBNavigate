"use strict";

function DirectionsView(isTouch, roomService, navigateView, pathFindingService) {

	// Fields and definitions
	
	let me = this;

	this.classDefinitions = {
		startNavigationButtons: "vubn-navigate-start",
		stopNavigationButtons: "vubn-navigate-stop",
		myLocationTexts: "vubn-navigate-mylocation",
		destinationTexts: "vubn-navigate-destination"
	};

	this.idDefinitions = {
		stopNavigationDialog: "vubn-navigate-stopnavigation-dialog",
		stopNavigationConfirm: "vubn-navigate-stopnavigation-dialog-stop",
		stopNavigationDeny: "vubn-navigate-stopnavigation-dialog-continue"
	};

	this.clickEvent = (isTouch ? "touchend" : "click");

	// Dom Object

	this.startNavigationButtons = null;
	this.stopNavigationButtons = null;
	this.myLocationTexts = null;
	this.destinationTexts = null;
	this.stopNavigationDialog = null;
	this.stopNavigationConfirmButton = null;
	this.stopNavigationDenyButton = null;
	
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
		.then((room) => {
			var steps = pathFindingService.findPath(16 , room.id).then((segments) => {
				// NEED TO DISPLAY IN VIEW
				console.log(segments);
			});
			
		})
		.catch(console.error);
	};

	this.onStopNavigationRequest = function (event) {
		event.stopPropagation();
		// Open the dialog for a request to the user
		me.stopNavigationDialog.showModal();
	};

	this.onStopNavigationDenied = function (event) {
		event.stopPropagation();
		// Just close the dialog -> do nothing special
		me.stopNavigationDialog.close();
	};

	this.onStopNavigation = function (event) {
		// The navigation really has to stop now
		event.stopPropagation();
		console.log("Navigation will stop");
		me.stopNavigationDialog.close();
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
			this.stopNavigationDialog = document.getElementById(this.idDefinitions.stopNavigationDialog);
			this.stopNavigationConfirmButton = document.getElementById(this.idDefinitions.stopNavigationConfirm);
			this.stopNavigationDenyButton = document.getElementById(this.idDefinitions.stopNavigationDeny);
			
			// On some browsers, the dialog element is not supported. This polyfill provides a replacement.
			if (! this.stopNavigationDialog.showModal) {
				console.log("This browser has no native support for dialogs. We are using a polyfill to replace that functionality.")
				console.log(dialogPolyfill);
				dialogPolyfill.registerDialog(this.stopNavigationDialog);
			}

			// Add listeners
			
			this.stopNavigationButtons.forEach((button, index) => {
				button.addEventListener(this.clickEvent, this.onStopNavigationRequest);
			});

			this.startNavigationButtons.forEach((button, index) => {
				button.addEventListener(this.clickEvent, this.onStartNavigation);
			});
			
			this.stopNavigationDenyButton.addEventListener(this.clickEvent, this.onStopNavigationDenied);
			this.stopNavigationConfirmButton.addEventListener(this.clickEvent, this.onStopNavigation);

			resolve();
		});
	};
}

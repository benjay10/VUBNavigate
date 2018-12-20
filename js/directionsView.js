"use strict";

function DirectionsView(isTouch, roomService, navigateView, pathFindingService, locationService, speechService) {

	// Fields and definitions

	let me = this;

	this.classDefinitions = {
		hidden: "hidden",
		startNavigationButtons: "vubn-navigate-start",
		stopNavigationButtons: "vubn-navigate-stop",
		myLocationTexts: "vubn-navigate-mylocation",
		destinationTexts: "vubn-navigate-destination",
		directionText: "vubn-navigate-direction-text"
	};

	this.idDefinitions = {
		stopNavigationDialog: "vubn-navigate-stopnavigation-dialog",
		stopNavigationConfirm: "vubn-navigate-stopnavigation-dialog-stop",
		stopNavigationDeny: "vubn-navigate-stopnavigation-dialog-continue",
		navigationSpinner: "vubn-navigate-spinner",
		sideBarCard: "vubn-navigate-sidebar-card-container",
		stepsContainer: "vubn-navigate-steps-container",
		stepTemplate: "vubn-navigate-step-template",
	};

	this.clickEvent = (isTouch ? "touchend" : "click");
	this.selectedRoomId = null;
	this.currentLocationId = null;

	// Dom Object

	this.startNavigationButtons = null;
	this.stopNavigationButtons = null;
	this.myLocationTexts = null;
	this.destinationTexts = null;
	this.stopNavigationDialog = null;
	this.stopNavigationConfirmButton = null;
	this.stopNavigationDenyButton = null;
	this.navigationStepsText = null;
	this.navigationSpinner = null;
	this.sideBarCard = null;
	this.stepTemplate = null;
	this.stepsContainer = null;

	// Methods

	this.onStartNavigation = function(event) {
		event.stopPropagation();
		me.selectedRoomId = navigateView.selectedRoomId;

		return new Promise((resolve, reject) => {
			me.showSpinner();
			resolve(me.selectedRoomId);
		}).then(roomService.getRoom).then((room) => {
			// Set the destination fields
			me.destinationTexts.forEach((element, index) => {
				element.innerHTML = room.legalName;
			});
			// Show card in the side bar
			me.showSideBarCard();
			return room;
		}).then((room) => {
			locationService.startLocation();
			locationService.onLocationFoundEventer.addEvent(me.onLocationFound);
		});
	};

	this.onLocationFound = function (locationId) {
		// This method is executed in a Promise already
		
		locationId = parseInt(locationId);
		
		// Only necessary to do something if we have actually moved
		if (me.currentLocationId !== locationId) {
			
			me.currentLocationId = locationId;
			let speaker = null;

			roomService.getRoom(locationId).then((curRoom) => {
				// Speak the current location
				speaker = speechService.speakCurrentLocation(curRoom);
				
				// Set the found current location in the fields
				me.myLocationTexts.forEach((domObj, index) => {
					domObj.innerHTML = curRoom.legalName;
				});
			}).then(() => {
				me.showSpinner();
				me.removeSteps();
			}).then(() => { return pathFindingService.findPath(locationId, me.selectedRoomId); }).then((segments) => {
				let adders = [];
				if (segments.length > 0) {
					segments.forEach((s, index) => { adders.push(me.addStep(s)); });
					speaker.then(() => { speechService.speakStep(segments[0]); });
				}
				return Promise.all(adders);
			}).then((x) => {
				me.hideSpinner();
			}).catch(console.error);
		} else {
			console.log("Your location has not changed");
		}
	};

	this.onStopNavigationRequest = function(event) {
		event.stopPropagation();
		// Open the dialog for a request to the user
		me.stopNavigationDialog.showModal();
	};

	this.onStopNavigationDenied = function(event) {
		event.stopPropagation();
		// Just close the dialog -> do nothing special
		me.stopNavigationDialog.close();
	};

	this.onStopNavigation = function(event) {
		// The navigation really has to stop now
		event.stopPropagation();
		locationService.onLocationFoundEventer.removeEvent(me.onLocationFound);
		// Also hide the card in the side bar
		me.hideSideBarCard();
		me.removeSteps();
		me.myLocationTexts.forEach((domObj, index) => {
			domObj.innerHTML = "Searching&hellip;";
		});
		me.currentLocationId = null;
		me.stopNavigationDialog.close();
	};

	// Helpers
	
	this.addStep = function (text) {
		return me.stepTemplate.getObject().then((domObj) => {
			let textWrapper = domObj.getElementsByClassName(me.classDefinitions.directionText)[0];
			textWrapper.innerHTML = text;
			me.stepsContainer.appendChild(domObj);
		});
	};
	this.removeSteps = function () {
		me.stepsContainer.innerHTML = "";
	};
	
	this.showSideBarCard = function () {
		me.sideBarCard.classList.remove(me.classDefinitions.hidden);
	};
	this.hideSideBarCard = function () {
		me.sideBarCard.classList.add(me.classDefinitions.hidden);
	};

	this.showSpinner = function () {
		me.navigationSpinner.classList.remove(me.classDefinitions.hidden);
	};
	this.hideSpinner = function () {
		me.navigationSpinner.classList.add(me.classDefinitions.hidden);
	};

	// Init

	this.init = function() {
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
			this.stopNavigationDenyButton = document.getElementById(this.idDefinitions.stopNavigationDeny);
			this.navigationSpinner = document.getElementById(this.idDefinitions.navigationSpinner);
			this.sideBarCard = document.getElementById(this.idDefinitions.sideBarCard);
			this.stepsContainer = document.getElementById(this.idDefinitions.stepsContainer);

			// On some browsers, the dialog element is not supported. This polyfill provides a replacement.
			if (!this.stopNavigationDialog.showModal) {
				console.log("This browser has no native support for dialogs. We are using a polyfill to replace that functionality.")
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

			// Make the templates
			
			this.stepTemplate = new Templator(this.idDefinitions.stepTemplate);

			resolve();
		});
	};
}

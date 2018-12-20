"use strict";

function DirectionsView(isTouch, roomService, navigateView, pathFindingService, locationService) {

	// Fields and definitions

	let me = this;

	this.classDefinitions = {
		hidden: "hidden",
		startNavigationButtons: "vubn-navigate-start",
		stopNavigationButtons: "vubn-navigate-stop",
		myLocationTexts: "vubn-navigate-mylocation",
		destinationTexts: "vubn-navigate-destination"
	};

	this.idDefinitions = {
		stopNavigationDialog: "vubn-navigate-stopnavigation-dialog",
		stopNavigationConfirm: "vubn-navigate-stopnavigation-dialog-stop",
		stopNavigationDeny: "vubn-navigate-stopnavigation-dialog-continue",
		navigationSteps: "vubn-navigate-steps",
		navigationSpinner: "vubn-navigate-spinner",
		sideBarCard: "vubn-navigate-sidebar-card-container"
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
	this.navigationStepsText = null;
	this.navigationSpinner = null;
	this.sideBarCard = null;

	// Methods

	this.onStartNavigation = function(event) {
		event.stopPropagation();
		let roomId = navigateView.selectedRoomId;

		return new Promise((resolve, reject) => {
			me.showSpinner();
			resolve(roomId);
		}).then(roomService.getRoom).then((room) => {
			// Set the destination fields
			me.destinationTexts.forEach((element, index) => {
				element.innerHTML = room.legalName;
			});
			// Show card in the side bar
			me.showSideBarCard();
			return room;
		}).then((x) => {
			return locationService.getLocation();
		}).then((location) => {
			return pathFindingService.findPath(parseInt(location), room.id);
		}).then((segments) => {
			// TODO: use templates
			let html = "<ol class='demo-list-item mdl-list'>";
			segments.forEach((sgmnt) => {
				html += "<li class='mdl-list__item'><span class='mdl-list__item-primary-content'>" + sgmnt + "</span></li>";
			});
			html += "</ol>";
			me.navigationStepsText.innerHTML = html;
			return null;
		}).then((x) => {
			me.hideSpinner();
		})
		.catch(console.error);
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
		console.log("Navigation will stop");
		// Also hide the card in the side bar
		me.hideSideBarCard();
		me.stopNavigationDialog.close();
	};

	// Helpers
	
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
			this.navigationStepsText = document.getElementById(this.idDefinitions.navigationSteps);
			this.navigationSpinner = document.getElementById(this.idDefinitions.navigationSpinner);
			this.sideBarCard = document.getElementById(this.idDefinitions.sideBarCard);

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

			resolve();
		});
	};
}

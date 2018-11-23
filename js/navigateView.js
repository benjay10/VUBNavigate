"use strict";

function NavigateView(isTouch, roomService) {
	
	// Fields and definitions

	this.buildingButtons = null;
	this.floorButtons = null;
	this.classDefinitions = {
		buildingButton: "vubn-building-button",
		floorButton: "vubn-floor-button",
		normalButtonStyle: "mdl-button--accent",
		roomSelectButtonsContainer: "vubn-select-room-buttons",
		roomSelectButtonTemplate: "vubn-select-room-button-template",
		roomSelectSpinner: "vubn-navigate-select-busyspinner",
		roomSearchButtonsContainer: "vubn-search-room-buttons",
		roomSearchButtonTemplate: "vubn-search-room-button-template",
		roomSearchSpinner: "vubn-navigate-search-busyspinner",
		roomSearchInput: "vubn-room-search",
		hidden: "hidden"
	};
	this.dataDefinitions = {
		building: "data-vubn-select-building",
		floor: "data-vubn-select-floor",
		room: "data-vubn-select-room"
	};

	// Containers
	
	this.roomSelectButtonsContainer = null;
	this.roomSearchButtonsContainer = null;
	
	// Other

	this.roomSelectTemplator = null;
	this.roomSearchTemplator = null;
	this.roomSearchInput = null;
	this.roomSearchSpinner = null;
	this.roomSelectSpinner = null;

	// Methods

	this.onBuildingButtonClick = function (event, me) {
		event.stopPropagation();
		me.doHighlight(event.currentTarget, me.buildingButtons, me);
		let building = event.currentTarget.getAttribute(this.dataDefinitions.building);
		this.makeRandomRooms();
	};

	this.onFloorButtonClick = function (event, me) {
		event.stopPropagation();
		me.doHighlight(event.currentTarget, me.floorButtons, me);
		let floor = event.currentTarget.getAttribute(this.dataDefinitions.floor);
		this.makeRandomRooms();
	};
	
	// For the selection part (clicking on the room buttons)
	this.onRoomSelectButtonClick = function (event, me) {
		event.stopPropagation();
		let allRoomButtons = this.roomSelectButtonsContainer.childNodes;
		allRoomButtons = [].slice.call(allRoomButtons);
		me.doHighlight(event.currentTarget, allRoomButtons, me);
	};

	this.showSelectSpinner = function () {
		this.roomSelectSpinner.classList.remove(this.classDefinitions.hiddden);
	};
	this.hideSelectSpinner = function () {
		this.roomSelectSpinner.classList.add(this.classDefinitions.hiddden);
	};

	// Search

	this.onRoomSearchInput = function (event, me) {
		event.stopPropagation();
		//TODO: finalise
		return new Promise((resolve, reject) => {
			let input = event.target.value;
			if (input.length > 1) {
				resolve(input);
			}
		})
		.then((inputString) => {
			// Clear previous results
			me.clearPreviousSearchResults();
			// Show spinner
			me.showSearchSpinner();
			return inputString;
		})
		.then((inputString) => {
			// Start the search
			return roomService.searchRooms(inputString);
		})
		.then((resultRooms) => {
			// form the results on screen
			// TODO
			return;
		})
		.then(() => {
			// Hide the spinner
			me.hideSearchSpinner();
		});
	};

	this.clearPreviousSearchResults = function () {
		this.roomSearchButtonsContainer.innerHTML = "";
	};

	this.showSearchSpinner = function () {
		this.roomSearchSpinner.classList.remove(this.classDefinitions.hidden);
	};
	this.hideSearchSpinner = function () {
		this.roomSearchSpinner.classList.add(this.classDefinitions.hidden);
	};

	this.onRoomSearchButtonClick = function (event, me) {
		event.stopProgation();
		console.log("OnRoomSearchButtonClick");
		//TODO
	};

	// Rest

	this.doHighlight = function (target, all, me) {
		all.forEach((button, index) => {
			button.classList.remove(me.classDefinitions.normalButtonStyle);
		});
		target.classList.add(me.classDefinitions.normalButtonStyle);
	};

	// Stupid method, be gone in the future please
	this.makeRandomRooms = function () {
		let me = this;
		this.roomSelectButtonsContainer.innerHTML = "";
		let rooms = roomService.searchRooms("abc");
		let roomButtons = [];
		for (let i = 0; i < rooms.length; i++) {
			roomButtons[i] = this.roomSelectTemplator.getObject();
		}
		Promise.all(roomButtons).then((values) => {
			for (let i = 0; i < rooms.length; i++) {
				values[i].innerHTML = rooms[i].legalName;
				me.roomSelectButtonsContainer.appendChild(values[i]);
			}
			componentHandler.upgradeAllRegistered();
			[].slice.call(this.roomSelectButtonsContainer.childNodes).forEach((button, index) => {
				button.addEventListener("click", (event) => this.onRoomSelectButtonClick(event, me));
			});
		});
	};

	// Initialisation

	this.init = function () {
		return new Promise((resolve, reject) => {
			
			// Type of click event
			let clickOrTouchEnd = isTouch ? "touchend" : "click";

			//Search containers
			this.roomSelectButtonsContainer = document.getElementById(this.classDefinitions.roomSelectButtonsContainer);
			this.roomSearchButtonsContainer = document.getElementById(this.classDefinitions.roomSearchButtonsContainer);

			// Search all the buttons
			this.buildingButtons = document.getElementsByClassName(this.classDefinitions.buildingButton);
			this.floorButtons = document.getElementsByClassName(this.classDefinitions.floorButton);
			this.buildingButtons = [].slice.call(this.buildingButtons);
			this.floorButtons = [].slice.call(this.floorButtons);
			
			// Search for the input box
			this.roomSearchInput = document.getElementById(this.classDefinitions.roomSearchInput);
			
			// Add event listeners
			this.buildingButtons.forEach((button, index) => {
				button.addEventListener(clickOrTouchEnd, (event) => this.onBuildingButtonClick(event, this));
			});
			this.floorButtons.forEach((button, index) => {
				button.addEventListener(clickOrTouchEnd, (event) => this.onFloorButtonClick(event, this));
			});
			this.roomSearchInput.addEventListener("input", (event) => this.onRoomSearchInput(event, this));

			// Creates a templator and remove the template from the page
			this.roomSelectTemplator = new Templator(this.classDefinitions.roomSelectButtonTemplate);
			this.roomSearchTemplator = new Templator(this.classDefinitions.roomSearchButtonTemplate);

			// Search for the container of the room buttons
			this.roomSelectButtonsContainer = document.getElementById(this.classDefinitions.roomSelectButtonsContainer);
			this.roomSearchButtonsContainer = document.getElementById(this.classDefinitions.roomSearchButtonsContainer);
			
			this.roomSelectSpinner = document.getElementById(this.classDefinitions.roomSelectSpinner);
			this.roomSearchSpinner = document.getElementById(this.classDefinitions.roomSearchSpinner);

			resolve();
		});
	};
}


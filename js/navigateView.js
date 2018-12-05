"use strict";

function NavigateView(isTouch, roomService, directionsView) {
	
	// Fields and definitions

	this.buildingButtons = null;
	this.floorButtons = null;
	this.classDefinitions = {
		buildingButton: "vubn-building-button",
		floorButton: "vubn-floor-button",
		normalButtonStyle: "mdl-button--accent",
		hidden: "hidden"
	};
	this.idDefinitions = {
		searchNothingFound: "vubn-navigate-search-nothingfound",
		searchNothingFoundText: "vubn-navigate-search-nothingfound-text",
		selectNothingFound: "vubn-navigate-select-nothingfound",
		selectNothingFoundText: "vubn-navigate-select-nothingfound-text",
		roomSelectButtonTemplate: "vubn-select-room-button-template",
		roomSearchButtonTemplate: "vubn-search-room-button-template",
		roomSelectButtonsContainer: "vubn-select-room-buttons",
		roomSearchButtonsContainer: "vubn-search-room-buttons",
		roomSelectSpinner: "vubn-navigate-select-busyspinner",
		roomSearchSpinner: "vubn-navigate-search-busyspinner",
		roomSearchInput: "vubn-room-search",
		searchStartNavigationButton: "vubn-navigate-search-start-navigation",
		selectStartNavigationButton: "vubn-navigate-select-start-navigation",
		calendarStartNavigationButton: "vubn-navigate-calendar-start-navigation"
	};
	this.dataDefinitions = {
		building: "data-vubn-select-building",
		floor: "data-vubn-select-floor",
		room: "data-vubn-select-room",
		roomid: "data-vubn-roomid"
	};
	this.clickEvent = (isTouch ? "touchend" : "click");

	// Containers
	
	this.roomSelectButtonsContainer = null;
	this.roomSearchButtonsContainer = null;

	// States
	
	this.selectedBuilding = null;
	this.selectedFloor = null;
	this.selectedRoomId = null;
	
	// Other

	this.roomSelectTemplator = null;
	this.roomSearchTemplator = null;
	this.roomSearchInput = null;
	this.roomSearchSpinner = null;
	this.roomSelectSpinner = null;
	this.searchNothingFound = null;
	this.selectNothingFound = null;
	this.searchStartNavigationButton = null;
	this.selectStartNavigationButton = null;
	this.calendarStartNavigationButton = null;

	// Methods
	
	// Select

	this.onBuildingButtonClick = function (event, me) {
		event.stopPropagation();
		me.doHighlight(event.currentTarget, me.buildingButtons, me);
		me.clearHighlight(me.floorButtons, me);
		me.selectedBuilding = event.currentTarget.getAttribute(me.dataDefinitions.building);
		me.selectedFloor = null;
		let disabler = roomService.getBuilding(me.selectedBuilding).then((building) => {
			me.floorButtons.forEach((floorButton, index) => {
				let floor = parseInt(floorButton.getAttribute(me.dataDefinitions.floor));
				if (floor <= building.maxFloor && floor >= building.minFloor) {
					floorButton.removeAttribute("disabled");
				} else {
					floorButton.setAttribute("disabled", "disabled");
				}
			});
		});
		let filterer = me.filterRooms(me);
		// Also disable the start navigation button
		me.disableSelectStartNavigationButton();
		return Promise.all([disabler, filterer]).then((values) => { return values[1]; });
	};

	this.onFloorButtonClick = function (event, me) {
		event.stopPropagation();
		me.doHighlight(event.currentTarget, me.floorButtons, me);
		me.selectedFloor = event.currentTarget.getAttribute(me.dataDefinitions.floor);
		return me.filterRooms(me);
	};

	this.filterRooms = function (me) {
		return new Promise((resolve, reject) => {
			if (me.selectedBuilding && me.selectedFloor) {
				resolve();
			} else {
				me.clearPreviousSelectResults();
				me.hideSearchSpinner();
				me.hideSelectNothingFound();
			}
		})
		.then(() => {
			me.clearPreviousSelectResults();
			me.showSelectSpinner();
			me.hideSelectNothingFound();
		})
		.then(() => {
			// Do actual search
			let building = me.selectedBuilding;
			let floor = me.selectedFloor;
			return roomService.getRoomsInBuildingFloor(building, floor);
		})
		.then((resultRooms) => {
			resultRooms.forEach((room, index) => {
				me.addSelectResult(room);
			});
			componentHandler.upgradeAllRegistered();
			return;
		})
		.then(() => {
			me.hideSelectSpinner();
		})
		.catch((error) => {
			me.clearPreviousSelectResults();
			me.hideSearchSpinner();
			console.error(error);
			me.showSelectNothingFound(error);
		});
	};
	
	// For the selection part (clicking on the room buttons)
	this.onRoomSelectButtonClick = function (event, me) {
		event.stopPropagation();
		me.selectedRoomId = parseInt(event.currentTarget.getAttribute(me.dataDefinitions.roomid));
		let allRoomButtons = this.roomSelectButtonsContainer.childNodes;
		allRoomButtons = [].slice.call(allRoomButtons);
		me.doHighlight(event.currentTarget, allRoomButtons, me);
		me.enableSelectStartNavigationButton();
	};

	this.showSelectSpinner = function () {
		this.roomSelectSpinner.classList.remove(this.classDefinitions.hiddden);
	};
	this.hideSelectSpinner = function () {
		this.roomSelectSpinner.classList.add(this.classDefinitions.hiddden);
	};

	this.disableSelectStartNavigationButton = function () {
		this.selectStartNavigationButton.setAttribute("disabled", "disabled");
	};
	this.enableSelectStartNavigationButton = function () {
		this.selectStartNavigationButton.removeAttribute("disabled");
	};

	this.showSelectNothingFound = function (text) {
		this.selectNothingFound.classList.remove(this.classDefinitions.hidden);
		document.getElementById(this.idDefinitions.selectNothingFoundText).innerHTML = text;
	};
	this.hideSelectNothingFound = function () {
		this.selectNothingFound.classList.add(this.classDefinitions.hidden);
	};

	this.clearPreviousSelectResults = function () {
		this.roomSelectButtonsContainer.innerHTML = "";
	};

	this.addSelectResult = function (room) {
		return this.roomSelectTemplator.getObject().then((roomButton) => {
			roomButton.innerHTML = room.legalName;
			roomButton.setAttribute(this.dataDefinitions.roomid, room.id);
			this.roomSelectButtonsContainer.appendChild(roomButton);
			roomButton.addEventListener(this.clickEvent, (event) => this.onRoomSelectButtonClick(event, this));
		});
	};

	// Search

	this.onRoomSearchInput = function (event, me) {
		event.stopPropagation();
		return new Promise((resolve, reject) => {
			// Take the input and trim spaces of the ends
			let input = event.target.value;
			input = input.trim();
			
			// Disable the button because every input change triggers a different set of results
			me.disableSearchStartNavigationButton();
		
			if (input.length > 2) {
				resolve(input);
			} else {
				// Input is too short or input was removed
				me.clearPreviousSearchResults();
				me.hideSearchSpinner();
				me.hideSearchNothingFound();
			}
		})
		.then((inputString) => {
			// Clear previous results
			me.clearPreviousSearchResults();
			me.hideSearchNothingFound();
			// Show spinner
			me.showSearchSpinner();
			return inputString;
		})
		.then((inputString) => {
			// Start the search
			return roomService.searchRooms(inputString);
		})
		.then((resultRooms) => {
			// Form the results on screen
			//console.log(resultRooms);
			resultRooms.forEach((room, index) => {
				me.addSearchResult(room);
			});
			componentHandler.upgradeAllRegistered();
			return;
		})
		.then(() => {
			// Hide the spinner
			me.hideSearchSpinner();
		})
		.catch((error) => {
			me.clearPreviousSearchResults();
			me.hideSearchSpinner();
			console.error(error);
			me.showSearchNothingFound(error);
		});
	};

	this.clearPreviousSearchResults = function () {
		this.roomSearchButtonsContainer.innerHTML = "";
	};

	this.addSearchResult = function (room) {
		let me = this;
		return this.roomSearchTemplator.getObject().then((roomButton) => {
			roomButton.innerHTML = room.legalName;
			roomButton.setAttribute(me.dataDefinitions.roomid, room.id);
			this.roomSearchButtonsContainer.appendChild(roomButton);
			roomButton.addEventListener(this.clickEvent, (event) => this.onRoomSearchButtonClick(event, this));
		});
	};
	
	this.disableSearchStartNavigationButton = function () {
		this.searchStartNavigationButton.setAttribute("disabled", "disabled");
	};
	this.enableSearchStartNavigationButton = function () {
		this.searchStartNavigationButton.removeAttribute("disabled");
	};

	this.showSearchSpinner = function () {
		this.roomSearchSpinner.classList.remove(this.classDefinitions.hidden);
	};
	this.hideSearchSpinner = function () {
		this.roomSearchSpinner.classList.add(this.classDefinitions.hidden);
	};

	this.showSearchNothingFound = function (text) {
		this.searchNothingFound.classList.remove(this.classDefinitions.hidden);
		document.getElementById(this.idDefinitions.searchNothingFoundText).innerHTML = text;
	};
	this.hideSearchNothingFound = function () {
		this.searchNothingFound.classList.add(this.classDefinitions.hidden);
	};

	this.onRoomSearchButtonClick = function (event, me) {
		event.stopPropagation();
		me.selectedRoomId = parseInt(event.currentTarget.getAttribute(me.dataDefinitions.roomid));
		let allRoomButtons = this.roomSearchButtonsContainer.childNodes;
		allRoomButtons = [].slice.call(allRoomButtons);
		me.doHighlight(event.currentTarget, allRoomButtons, me);
		me.enableSearchStartNavigationButton();
	};

	// Rest

	this.doHighlight = function (target, all, me) {
		all.forEach((button, index) => {
			button.classList.remove(me.classDefinitions.normalButtonStyle);
		});
		target.classList.add(me.classDefinitions.normalButtonStyle);
	};

	this.clearHighlight = function (all, me) {
		all.forEach((button, index) => {
			button.classList.add(me.classDefinitions.normalButtonStyle);
		});
	};

	// Initialisation

	this.init = function () {
		return new Promise((resolve, reject) => {
			
			//Search containers
			this.roomSelectButtonsContainer = document.getElementById(this.idDefinitions.roomSelectButtonsContainer);
			this.roomSearchButtonsContainer = document.getElementById(this.idDefinitions.roomSearchButtonsContainer);

			// Search all the buttons
			this.buildingButtons = document.getElementsByClassName(this.classDefinitions.buildingButton);
			this.floorButtons = document.getElementsByClassName(this.classDefinitions.floorButton);
			this.buildingButtons = [].slice.call(this.buildingButtons);
			this.floorButtons = [].slice.call(this.floorButtons);
			
			// Search for the input box
			this.roomSearchInput = document.getElementById(this.idDefinitions.roomSearchInput);
			
			// Add event listeners
			this.buildingButtons.forEach((button, index) => {
				button.addEventListener(this.clickEvent, (event) => this.onBuildingButtonClick(event, this));
			});
			this.floorButtons.forEach((button, index) => {
				button.addEventListener(this.clickEvent, (event) => this.onFloorButtonClick(event, this));
			});
			this.roomSearchInput.addEventListener("input", (event) => this.onRoomSearchInput(event, this));

			// Creates a templator and remove the template from the page
			this.roomSelectTemplator = new Templator(this.idDefinitions.roomSelectButtonTemplate);
			this.roomSearchTemplator = new Templator(this.idDefinitions.roomSearchButtonTemplate);

			this.roomSelectSpinner = document.getElementById(this.idDefinitions.roomSelectSpinner);
			this.roomSearchSpinner = document.getElementById(this.idDefinitions.roomSearchSpinner);

			this.searchNothingFound = document.getElementById(this.idDefinitions.searchNothingFound);
			this.selectNothingFound = document.getElementById(this.idDefinitions.selectNothingFound);

			this.searchStartNavigationButton = document.getElementById(this.idDefinitions.searchStartNavigationButton);
			this.selectStartNavigationButton = document.getElementById(this.idDefinitions.selectStartNavigationButton);
			this.calendarStartNavigationButton = document.getElementById(this.idDefinitions.calendarStartNavigationButton);

			resolve();
		});
	};
}


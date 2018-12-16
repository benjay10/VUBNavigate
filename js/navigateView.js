"use strict";

function NavigateView(isTouch, roomService, calendarService) {
	
	// Fields and definitions
	
	let me = this;

	this.buildingButtons = null;
	this.floorButtons = null;
	this.classDefinitions = {
		buildingButton: "vubn-building-button",
		floorButton: "vubn-floor-button",
		normalButtonStyle: "mdl-button--accent",
		hidden: "hidden",
		calendarTitle: "vubn-calendar-event-title",
		calendarStartTime: "vubn-calendar-event-starttime",
		calendarEndTime: "vubn-calendar-event-endtime",
		calendarLocation: "vubn-calendar-event-location",
		calendarDescription: "vubn-calendar-event-description"
	};
	this.idDefinitions = {
		searchNothingFound: "vubn-navigate-search-nothingfound",
		searchNothingFoundText: "vubn-navigate-search-nothingfound-text",
		selectNothingFound: "vubn-navigate-select-nothingfound",
		selectNothingFoundText: "vubn-navigate-select-nothingfound-text",
		calendarNothingFound: "vubn-navigate-calendar-nothingfound",
		calendarNothingFoundText: "vubn-navigate-calendar-nothingfound-text",
		roomSelectButtonTemplate: "vubn-select-room-button-template",
		roomSearchButtonTemplate: "vubn-search-room-button-template",
		calendarEventButtonTemplate: "vubn-calendar-event-template",
		roomSelectButtonsContainer: "vubn-select-room-buttons",
		roomSearchButtonsContainer: "vubn-search-room-buttons",
		calendarEventsContainer: "vubn-calendar-events",
		roomSelectSpinner: "vubn-navigate-select-busyspinner",
		roomSearchSpinner: "vubn-navigate-search-busyspinner",
		calendarSpinner: "vubn-navigate-calendar-busyspinner",
		roomSearchInput: "vubn-room-search",
		calendarRefreshButton: "vubn-calendar-refresh",
		searchStartNavigationButton: "vubn-navigate-search-start-navigation",
		selectStartNavigationButton: "vubn-navigate-select-start-navigation",
		calendarStartNavigationButton: "vubn-navigate-calendar-start-navigation",
		calendarIntroButton: "vubn-intro-calendar"
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
	this.calendarEventsContainer = null;

	// States
	
	this.selectedBuilding = null;
	this.selectedFloor = null;
	this.selectedRoomId = null;
	
	// Other

	this.roomSelectTemplator = null;
	this.roomSearchTemplator = null;
	this.calendarEventTemplator = null;
	this.roomSearchInput = null;
	this.calendarRefreshButton = null;
	this.roomSearchSpinner = null;
	this.roomSelectSpinner = null;
	this.calendarSpinner = null;
	this.searchNothingFound = null;
	this.selectNothingFound = null;
	this.calendarNothingFound = null;
	this.searchNothingFoundText = null;
	this.selectNothingFoundText = null;
	this.calendarNothingFoundText = null;
	this.searchStartNavigationButton = null;
	this.selectStartNavigationButton = null;
	this.calendarStartNavigationButton = null;
	this.calendarIntroButton = null;

	// Methods
	
	// Select

	this.onBuildingButtonClick = function (event) {
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

	this.onFloorButtonClick = function (event) {
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
	this.onRoomSelectButtonClick = function (event) {
		event.stopPropagation();
		me.selectedRoomId = parseInt(event.currentTarget.getAttribute(me.dataDefinitions.roomid));
		let allRoomButtons = me.roomSelectButtonsContainer.childNodes;
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
		this.selectNothingFoundText.innerHTML = text;
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
			roomButton.addEventListener(this.clickEvent, this.onRoomSelectButtonClick);
		});
	};

	// Search

	this.onRoomSearchInput = function (event) {
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
		return this.roomSearchTemplator.getObject().then((roomButton) => {
			roomButton.innerHTML = room.legalName;
			roomButton.setAttribute(me.dataDefinitions.roomid, room.id);
			this.roomSearchButtonsContainer.appendChild(roomButton);
			roomButton.addEventListener(this.clickEvent, this.onRoomSearchButtonClick);
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
		this.searchNothingFoundText.innerHTML = text;
	};
	this.hideSearchNothingFound = function () {
		this.searchNothingFound.classList.add(this.classDefinitions.hidden);
	};

	this.onRoomSearchButtonClick = function (event) {
		event.stopPropagation();
		me.selectedRoomId = parseInt(event.currentTarget.getAttribute(me.dataDefinitions.roomid));
		let allRoomButtons = this.roomSearchButtonsContainer.childNodes;
		allRoomButtons = [].slice.call(allRoomButtons);
		me.doHighlight(event.currentTarget, allRoomButtons, me);
		me.enableSearchStartNavigationButton();
	};

	// Calendar stuff
	
	this.onCalendarRefresh = function (event) {
		event.stopPropagation();
		return new Promise((resolve, reject) => {
			me.showCalendarSpinner();
			// Disable the Go button
			me.disableCalendarStartNavigationButton();
			me.hideCalendarNothingFound();
			me.clearPreviousCalendarResults();
			resolve();
		}).then(calendarService.getEventsForToday)
		.then((events) => {
			let buttonMakers = [];
			events.forEach((e, index) => {
				buttonMakers.push(me.addCalendarResult(e));
			});
			Promise.all(buttonMakers).then((values) => componentHandler.upgradeAllRegistered());
			return;
		}).then(() => {
			me.hideCalendarSpinner();
		}).catch((error) => {
			console.error(error);
			me.showCalendarNothingFound(error);
		});
	};

	this.clearPreviousCalendarResults = function () {
		this.calendarEventsContainer.innerHTML = "";
	};

	this.addCalendarResult = function (vevent) {
		return me.calendarEventTemplator.getObject().then((eventButton) => {
			let startHour = ("00" + vevent.startDate.hour).slice(-2);
			let startMinute = ("00" + vevent.startDate.minute).slice(-2);
			let endHour = ("00" + vevent.endDate.hour).slice(-2);
			let endMinute = ("00" + vevent.endDate.minute).slice(-2);
			eventButton.getElementsByClassName(me.classDefinitions.calendarTitle)[0].innerHTML = vevent.summary;
			eventButton.getElementsByClassName(me.classDefinitions.calendarStartTime)[0].innerHTML = startHour + ":" + startMinute;
			eventButton.getElementsByClassName(me.classDefinitions.calendarEndTime)[0].innerHTML = endHour + ":" + endMinute;
			eventButton.getElementsByClassName(me.classDefinitions.calendarLocation)[0].innerHTML = vevent.location;
			//eventButton.getElementsByClassName(me.classDefinitions.calendarDescription)[0].innerHTML = vevent.description;
			
			let roomName = vevent.location.split(" ")[0];

			return roomService.searchRooms(roomName).then((results) => {
				let id = results[0].id;
				eventButton.setAttribute(me.dataDefinitions.roomid, id);
				eventButton.addEventListener(me.clickEvent, me.onEventButtonClick);
				me.calendarEventsContainer.appendChild(eventButton);
				componentHandler.upgradeDom();
			}).catch((NoResultsError) => {
				// No search results, but for now, still add the button to the interface
				eventButton.setAttribute(me.dataDefinitions.roomid, "");
				eventButton.setAttribute("disabled", "disabled");
				me.calendarEventsContainer.appendChild(eventButton);
				componentHandler.upgradeDom();
			});
		});
	};

	this.onEventButtonClick = function (event) {
		event.stopPropagation();
		let roomid = event.currentTarget.getAttribute(me.dataDefinitions.roomid);
		me.selectedRoomId = parseInt(roomid);
		let allVevents = me.calendarEventsContainer.childNodes;
		allVevents = [].slice.call(allVevents);
		me.doHighlight(event.currentTarget, allVevents, me);
		me.enableCalendarStartNavigationButton();
	};

	this.disableCalendarStartNavigationButton = function () {
		this.calendarStartNavigationButton.setAttribute("disabled", "disabled");
	};
	this.enableCalendarStartNavigationButton = function () {
		this.calendarStartNavigationButton.removeAttribute("disabled");
	};

	this.showCalendarSpinner = function () {
		this.calendarSpinner.classList.remove(this.classDefinitions.hidden);
	};
	this.hideCalendarSpinner = function () {
		this.calendarSpinner.classList.add(this.classDefinitions.hidden);
	};

	this.showCalendarNothingFound = function (text) {
		this.calendarNothingFound.classList.remove(this.classDefinitions.hidden);
		this.calendarNothingFoundText.innerHTML = text;
	};
	this.hideCalendarNothingFound = function () {
		this.calendarNothingFound.classList.add(this.classDefinitions.hidden);
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
			this.calendarEventsContainer = document.getElementById(this.idDefinitions.calendarEventsContainer);

			// Search all the buttons
			this.buildingButtons = document.getElementsByClassName(this.classDefinitions.buildingButton);
			this.buildingButtons = [].slice.call(this.buildingButtons);
			this.floorButtons = document.getElementsByClassName(this.classDefinitions.floorButton);
			this.floorButtons = [].slice.call(this.floorButtons);
			
			// Search for the input box
			this.roomSearchInput = document.getElementById(this.idDefinitions.roomSearchInput);

			// Search for the refresh button
			this.calendarRefreshButton = document.getElementById(this.idDefinitions.calendarRefreshButton);
			this.calendarIntroButton = document.getElementById(this.idDefinitions.calendarIntroButton);
			
			// Add event listeners
			this.buildingButtons.forEach((button, index) => {
				button.addEventListener(this.clickEvent, this.onBuildingButtonClick);
			});
			this.floorButtons.forEach((button, index) => {
				button.addEventListener(this.clickEvent, this.onFloorButtonClick);
			});
			this.roomSearchInput.addEventListener("input", this.onRoomSearchInput);
			this.calendarRefreshButton.addEventListener(this.clickEvent, this.onCalendarRefresh);
			this.calendarIntroButton.addEventListener(this.clickEvent, this.onCalendarRefresh);

			// Creates a templator and remove the template from the page
			this.roomSelectTemplator = new Templator(this.idDefinitions.roomSelectButtonTemplate);
			this.roomSearchTemplator = new Templator(this.idDefinitions.roomSearchButtonTemplate);
			this.calendarEventTemplator = new Templator(this.idDefinitions.calendarEventButtonTemplate);

			this.roomSelectSpinner = document.getElementById(this.idDefinitions.roomSelectSpinner);
			this.roomSearchSpinner = document.getElementById(this.idDefinitions.roomSearchSpinner);
			this.calendarSpinner = document.getElementById(this.idDefinitions.calendarSpinner);

			this.searchNothingFound = document.getElementById(this.idDefinitions.searchNothingFound);
			this.selectNothingFound = document.getElementById(this.idDefinitions.selectNothingFound);
			this.calendarNothingFound = document.getElementById(this.idDefinitions.calendarNothingFound);

			this.searchNothingFoundText = document.getElementById(this.idDefinitions.searchNothingFoundText);
			this.selectNothingFoundText = document.getElementById(this.idDefinitions.selectNothingFoundText);
			this.calendarNothingFoundText = document.getElementById(this.idDefinitions.calendarNothingFoundText);

			this.searchStartNavigationButton = document.getElementById(this.idDefinitions.searchStartNavigationButton);
			this.selectStartNavigationButton = document.getElementById(this.idDefinitions.selectStartNavigationButton);
			this.calendarStartNavigationButton = document.getElementById(this.idDefinitions.calendarStartNavigationButton);

			resolve();
		});
	};
}


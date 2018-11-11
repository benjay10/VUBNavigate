"use strict";

function NavigateView(isTouch, roomService) {
	
	this.buildingButtons = null;
	this.floorButtons = null;
	this.classDefinitions = {
		buildingButton: "vubn-building-button",
		floorButton: "vubn-floor-button",
		normalButtonStyle: "mdl-button--accent",
		roomButtonsContainer: "vubn-room-buttons",
		roomButtonTemplate: "vubn-room-button-template",
		roomButton: "vubn-room-button"
	};
	this.dataDefinitions = {
		building: "data-vubn-select-building",
		floor: "data-vubn-select-floor",
		room: "data-vubn-select-room"
	};
	this.roomTemplator = null;
	this.roomButtonsContainer = null;

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
	
	this.onRoomButtonClick = function (event, me) {
		event.stopPropagation();
		let allRoomButtons = document.getElementsByClassName(this.classDefinitions.roomButton);
		allRoomButtons = [].slice.call(allRoomButtons);
		me.doHighlight(event.currentTarget, allRoomButtons, me);
	};

	this.doHighlight = function (target, all, me) {
		all.forEach((button, index) => {
			button.classList.remove(me.classDefinitions.normalButtonStyle);
		});
		target.classList.add(me.classDefinitions.normalButtonStyle);
	};

	this.makeRandomRooms = function () {
		let me = this;
		this.roomButtonsContainer.innerHTML = "";
		let rooms = roomService.searchRooms("abc");
		let roomButtons = [];
		for (let i = 0; i < rooms.length; i++) {
			roomButtons[i] = this.roomTemplator.getObject();
		}
		console.log(roomButtons);
		Promise.all(roomButtons).then((values) => {
			for (let i = 0; i < rooms.length; i++) {
				values[i].innerHTML = rooms[i].legalName;
				me.roomButtonsContainer.appendChild(values[i]);
			}
			componentHandler.upgradeAllRegistered();
			[].slice.call(this.roomButtonsContainer.childNodes).forEach((button, index) => {
				button.addEventListener("click", (event) => this.onRoomButtonClick(event, me));
			});
		});
	};

	this.init = function () {
		return new Promise((resolve, reject) => {
			
			// Type of click event
			let clickOrTouchEnd = isTouch ? "touchend" : "click";

			// Search all the buttons
			this.buildingButtons = document.getElementsByClassName(this.classDefinitions.buildingButton);
			this.floorButtons = document.getElementsByClassName(this.classDefinitions.floorButton);
			this.buildingButtons = [].slice.call(this.buildingButtons);
			this.floorButtons = [].slice.call(this.floorButtons);
			
			// Add event listeners
			this.buildingButtons.forEach((button, index) => {
				button.addEventListener(clickOrTouchEnd, (event) => this.onBuildingButtonClick(event, this));
			});
			this.floorButtons.forEach((button, index) => {
				button.addEventListener(clickOrTouchEnd, (event) => this.onFloorButtonClick(event, this));
			});

			// Creates a templator and remove the template from the page
			this.roomTemplator = new Templator(this.classDefinitions.roomButtonTemplate);

			// Search for the container of the room buttons
			this.roomButtonsContainer = document.getElementById(this.classDefinitions.roomButtonsContainer);

			resolve();
		});
	};
}


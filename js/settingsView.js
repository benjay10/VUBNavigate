"use strict";

function SettingsView(isTouch, calendarService) {

	// Fields and definitions
	
	let me = this;
	this.touchEvent = (isTouch ? "touchend" : "click");
	
	this.idDefinitions = {
		calendarUrlInput: "vubn-settings-calurl",
		updateCalendarButton: "vubn-settings-updatecalendar"
	};

	this.calendarUrlInput = null;
	this.updateCalendarButton = null;
	
	// Methods
	
	this.onUpdateCalendar = function (event) {
		event.stopPropagation();
		return new Promise((resolve, reject) => {
			console.log(me.calendarUrlInput.value);
			resolve();
		});
	};

	// Init

	this.init = function () {
		return new Promise((resolve, rejct) => {

			this.calendarUrlInput = document.getElementById(this.idDefinitions.calendarUrlInput);
			this.updateCalendarButton = document.getElementById(this.idDefinitions.updateCalendarButton);

			// Add event listeners
			
			this.updateCalendarButton.addEventListener(this.touchEvent, this.onUpdateCalendar);
		});
	};
}

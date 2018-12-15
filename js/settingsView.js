"use strict";

function SettingsView(isTouch, settingsService) {

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
			// We should check the user's input for correctness, but yeah
			// Put url in the settings database and request a full refresh of the calendar data
			settingsService.registerCalendarUrl(me.calendarUrlInput.value).then((x) => {
				settingsService.updateCalendar().then(resolve).catch(reject);
			}).catch(reject);
		}).catch(console.error);
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

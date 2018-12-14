"use strict";

function SettingsService(databaseService, calendarService) {

	this.registerCalendarUrl = function (url) {
		return databaseService.setSetting("calUrl", url);
	};

	this.updateCalendar = function () {
		return calendarService.updateCalendar();
	};
	
	// Init
	
	this.init = function () {
		//Nothing yet
	};
}

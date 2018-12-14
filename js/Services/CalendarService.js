"use strict";

function CalendarService(databaseService, retreiveService) {

	// Methods
	
	this.updateCalendar = function () {
		return databaseService.getSetting("calUrl").then((url) => {
			return retreiveService.getText(url);
		}).then((calText) => {
			let jCalData = ICAL.parse(calText);
			let calComponents = new ICAL.Component(jCalData);
			let events = calComponents.getAllSubcomponents("vevent");
			return events;
		}).then((events) => {
			let reducedEvents = [];
			events.forEach((event, index) => {
				let temp = new ICAL.Event(event);
				reducedEvents.push({
					startDate: temp.startDate.toJSON(),
					endDate: temp.endDate.toJSON(),
					//startTime: temp.startDate.toString(),
					//endTime: temp.endDate.toString(),
					summary: temp.summary,
					description: temp.description,
					location: temp.location
				});
			});
			return reducedEvents;
		}).then((events) => {
			console.log(events);
		});
	};

	// Help
	
	this.getTodayInIcalFormat = function () {
		let date = new Date();
		return date.getFullYear().toString() + date.getMonth().toString() + date.getDate().toString();
	};
	
	this.init = function () {
		
	};
}

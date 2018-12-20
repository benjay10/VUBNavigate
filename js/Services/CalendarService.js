"use strict";

function CalendarService(databaseService, retreiveService) {

	let me = this;

	// Methods
	
	this.updateCalendar = function () {
		return databaseService.getSetting("calUrl").then(retreiveService.getText).then((calText) => {
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
					startDateString: temp.startDate.toICALString().split("T")[0],
					summary: temp.summary,
					description: temp.description,
					location: temp.location
				});
			});
			return reducedEvents;
		}).then((events) => {
			databaseService.replaceAllEvents(events);
		});
	};

	this.getEventsForToday = function () {
		return databaseService.getEventsForDate(me.getTodayInIcalFormat());
	};

	// Help
	
	this.getTodayInIcalFormat = function () {
		let date = new Date();
		//let date = new Date(2018, 11, 3, 12, 0, 0, 0);
		let year = ("0000" + date.getFullYear().toString()).slice(-4);
		let month = ("00" + (date.getMonth() + 1).toString()).slice(-2);
		let day = ("00" + date.getDate().toString()).slice(-2);
		return year + month + day;
	};
	
	this.init = function () {
		
	};
}

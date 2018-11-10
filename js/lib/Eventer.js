"use strict";

function Eventer() {
	this.events = [];

	this.addEvent = function (ev) {
		this.events.push(ev);
	};

	this.fire = function (eventargs) {
		this.events.forEach((ev, index) => {
			return new Promise((resolve, reject) => {
				ev(eventargs);
				resolve();
			});
		});
	};
}

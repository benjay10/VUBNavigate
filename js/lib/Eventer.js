"use strict";

function Eventer() {
	this.events = [];

	this.addEvent = function (ev) {
		this.events.push(ev);
	};

	this.removeEvent = function (ev) {
		for (let i = 0; i < this.events.length; i++) {
			if (this.events[i] === ev) {
				this.events.splice(i, 1);
			}
		}
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

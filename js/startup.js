"use strict";

// Define all global modules here

var vubn = {
	const: {
		BROWSER: 0,
		MOBILE: 1
	},
	environment: 0,
	pageNavigation: null,
	useAnimations: false
}

// All global modules should be created here in order

window.addEventListener("load", (event) => {
	event.stopPropagation();

	vubn.pageNavigation = new PageNavigation();
	vubn.pageNavigation.init();
});

"use strict";

// Define all global modules here

var vubn = {
	const: {
		BROWSER: 0,
		MOBILE: 1
	},
	services: {
		rooms: null,
		database: null
	},
	environment: 0,
	drawerToggler: null,
	pageNavigation: null,
	subpageNavigate: null,
	useAnimations: false,
	navigateView: null
}

// All global modules should be created here in order

window.addEventListener("load", (event) => {
	event.stopPropagation();

	let isTouch = (vubn.environment === vubn.const.MOBILE);

	return (new Promise((resolve, reject) => {

		// Initialisation of all the services

		vubn.services.rooms = new RoomService();
		//vubn.services.database = new DatabaseService();
		//Other services
		
		resolve(vubn);

	})).then((notImportant) => {

		// Initialisation of the viewmodels and UI code

		vubn.pageNavigation = new PageNavigation({}, isTouch);
		vubn.pageNavigation.init();

		vubn.drawerToggler = new DrawerToggler();
		vubn.drawerToggler.init();

		vubn.subpageNavigation = new PageNavigation({
			page: "vubn-subpage-navigate",
			startpage: "vubn-subpage-navigate-startpage",
			pagecontainer: "navigate",
			navigationlink: "vubn-subpage-navigate-link",
			animIn: "vubn-page-anim-in",
			animOut: "vubn-page-anim-out"
		}, isTouch);
		vubn.subpageNavigation.init();

		vubn.navigateView = new NavigateView(isTouch, vubn.services.rooms);
		vubn.navigateView.init();
	});
});


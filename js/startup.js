"use strict";

// Define all global modules here

var vubn = {
	const: {
		BROWSER: 0,
		MOBILE: 1
	},
	services: {
		rooms: null,
		database: null,
		pathfinding: null,
	},
	environment: 0,
	drawerToggler: null,
	pageNavigation: null,
	subpageNavigate: null,
	useAnimations: false,
	navigateView: null,
	DirectionsView: null
}

// All global modules should be created here in order

window.addEventListener("load", (event) => {
	event.stopPropagation();

	let isTouch = (vubn.environment === vubn.const.MOBILE);

	return (new Promise((resolve, reject) => {

		// Initialisation of the database service first

		vubn.services.database = new DatabaseService();
		vubn.services.database.init().then((db) => resolve(vubn.services.database)).catch(reject);

	})).then((dbService) => {

		// Initialisation of other, dependent services (better way of doing this?)

		vubn.services.rooms = new RoomService2(dbService);
		vubn.services.rooms.init();

		vubn.services.pathfinding = new PathFindingService(vubn.services.rooms);
		vubn.services.pathfinding.init();

		vubn.services.location = new LocationService();
		vubn.services.location.init();

		return vubn;

	}).then((notImportant) => {

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

		vubn.directionsView = new DirectionsView(isTouch, vubn.services.rooms, vubn.navigateView);
		vubn.directionsView.init();
	});
});

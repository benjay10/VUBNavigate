"use strict";

// Define all global modules here

var vubn = {
	const: {
		BROWSER: 0,
		MOBILE: 1
	},
	services: {
		retreive: null,
		rooms: null,
		database: null,
		pathfinding: null,
		calendar: null,
		settings: null
	},
	environment: 0,
	drawerToggler: null,
	pageNavigation: null,
	subpageNavigate: null,
	useAnimations: false,
	navigateView: null,
	directionsView: null,
	settingsView: null
}

// All global modules should be created here in order

window.addEventListener("load", (event) => {
	event.stopPropagation();

	let isTouch = (vubn.environment === vubn.const.MOBILE);

	return (new Promise((resolve, reject) => {

		// Initialisation of the database service first

		vubn.services.retreive = new RetreiveService();
		vubn.services.retreive.init();

		vubn.services.database = new DatabaseService(vubn.services.retreive);
		vubn.services.database.init().then((db) => resolve(vubn.services.database));

		//resolve(vubn.services.database);

	})).then((dbService) => {

		// Initialisation of other, dependent services (better way of doing this?)

		vubn.services.rooms = new RoomService2(dbService);
		vubn.services.rooms.init();

		vubn.services.pathfinding = new PathFindingService(vubn.services.rooms);
		vubn.services.pathfinding.init();

		vubn.services.location = new LocationService();
		vubn.services.location.init();

		vubn.services.calendar = new CalendarService(dbService, vubn.services.retreive);
		vubn.services.calendar.init();

		vubn.services.settings = new SettingsService(dbService, vubn.services.calendar);
		vubn.services.settings.init();

		return vubn;

	}).then((notImportant) => {

		// Initialisation of the viewmodels and mostly UI code

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

		vubn.navigateView = new NavigateView(isTouch, vubn.services.rooms, vubn.services.calendar);
		vubn.navigateView.init();

		vubn.directionsView = new DirectionsView(isTouch, vubn.services.rooms, vubn.navigateView, vubn.services.pathfinding, vubn.services.location);
		vubn.directionsView.init();

		vubn.settingsView = new SettingsView(isTouch, vubn.services.settings);
		vubn.settingsView.init();
	});
});

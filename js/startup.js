"use strict";

// Define all global modules here

var vubn = {
	const: {
		BROWSER: 0,
		MOBILE: 1
	},
	environment: 0,
	drawerToggler: null,
	pageNavigation: null,
	subpageNavigate: null,
	useAnimations: false
}

// All global modules should be created here in order

window.addEventListener("load", (event) => {
	event.stopPropagation();

	vubn.pageNavigation = new PageNavigation();
	vubn.pageNavigation.init();

	vubn.drawerToggler = new DrawerToggler();
	vubn.drawerToggler.init();

	vubn.subpageNavigation = new PageNavigation({
		page: "vubn-subpage-navigate",
		startpage: "vubn-subpage-navigate-startpage",
		pagecontainer: "navigate",
		navigationlink: "vubn-subpage-navigate-link"
	});
	vubn.subpageNavigation.init();
});

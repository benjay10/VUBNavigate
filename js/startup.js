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

	let isTouch = (vubn.environment === vubn.const.MOBILE);

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
});

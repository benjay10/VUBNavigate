"use strict";

function DrawerToggler() {

	this.init = function () {	
		return new Promise((resolve, reject) => {

			let drawerlinks = document.querySelectorAll(".mdl-layout__drawer .vubn-navigate-link");
			let drawer = document.getElementsByClassName("mdl-layout")[0];
			let showNavigationButton = document.getElementById("vubn-drawer-show-navigation");
			let eventType = (vubn.environment === vubn.const.BROWSER) ? "click" : "touchend";

			// The links in the drawer should make the drawer disappear when clicked.
			drawerlinks.forEach((link, index) => {
				link.addEventListener(eventType, (event) => {
					drawer.MaterialLayout.toggleDrawer();
				});
			});

			// Clicking the button in the navigation card-thing in the drawer makes the drawer disappear
			showNavigationButton.addEventListener(eventType, (event) => {
				drawer.MaterialLayout.toggleDrawer();
			});
		});
	};
}

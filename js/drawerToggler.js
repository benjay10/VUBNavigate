"use strict";

function DrawerToggler() {

	this.init = function () {	
		return new Promise((resolve, reject) => {

			//let drawerlinks = document.querySelectorAll(".mdl-layout__drawer .vubn-navigate-link");
			let drawertemp = document.getElementsByClassName("mdl-layout__drawer")[0];
			let drawerlinks = drawertemp.getElementsByClassName("vubn-navigate-link");
			drawerlinks = [].slice.call(drawerlinks);
			let layout = document.getElementsByClassName("mdl-layout")[0];
			let showNavigationButton = document.getElementById("vubn-drawer-show-navigation");
			let stopNavigationButtons = drawertemp.getElementsByClassName("vubn-navigate-stop");
			stopNavigationButtons = [].slice.call(stopNavigationButtons);
			let eventType = (vubn.environment === vubn.const.BROWSER) ? "click" : "touchend";

			// The links in the drawer should make the drawer disappear when clicked.
			drawerlinks.forEach((link, index) => {
				link.addEventListener(eventType, (event) => {
					layout.MaterialLayout.toggleDrawer();
				});
			});

			// Clicking the button in the navigation card-thing in the drawer makes the drawer disappear
			showNavigationButton.addEventListener(eventType, (event) => {
				layout.MaterialLayout.toggleDrawer();
			});

			// Stopping the navigation also closes the drawer
			stopNavigationButtons.forEach((button, index) => {
				button.addEventListener(eventType, (event) => {
					layout.MaterialLayout.toggleDrawer();
				});
			});
		});
	};
}

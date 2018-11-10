"use strict";

function DrawerToggler() {

	this.init = function () {	
		return new Promise((resolve, reject) => {

			let drawerlinks = document.querySelectorAll(".mdl-layout__drawer .vubn-navigate-link");
			let drawer = document.getElementsByClassName("mdl-layout")[0];

			// The links in the drawer should make the drawer disappear when clicked.
			let eventType = (vubn.environment === vubn.const.BROWSER) ? "click" : "touchend";
			for (let i = 0; i < drawerlinks.length; i++) {
				drawerlinks[i].addEventListener(eventType, (event) => {
					drawer.MaterialLayout.toggleDrawer();
				});
			}
		});
	};
}

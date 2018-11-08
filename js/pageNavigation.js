"use strict";

function PageNavigation() {

	// Prototype variables
	
	this.pages = null;
	this.classes = {
		hidden: "hidden",
		page: "vubn-page",
		startpage: "vubn-startpage",
		pagecontainer: "vubn-pagecontainer",
		navigationlink: "vubn-navigate-link"
	};
	this.animator = null;
	this.pagecontainer = null;
	this.currentPage = null;
	this.useAnimations = vubn.useAnimations;
	this.pageOpenEventer = null;
	this.pageLeaveEventer = null;

	// Prototype functions
	
	this.navigatelinkOnClick = function (event) {
		// Get the target for every link (minus the '#' at the beginning)
		let link = event.currentTarget.getAttribute("href");
		link = link.substring(1, link.length);

		let foundPage  = false;
		for (let i = 0; i < this.pages.length; i++) {
			if (this.pages[i].getAttribute("id") === link) {
				this.hidePreviousPage();
				this.showPage(this.pages[i]);
				foundPage = true;
				break;
			}
		}
		if (! foundPage) {
			throw new Error("The page " + link + " could not be found.");
		}
	};

	this.hidePreviousPage = function () {
		let pageid = this.currentPage.getAttribute("id");
		this.pageLeaveEventer.fire(pageid);
		this.animator.setObject(this.currentPage).hide();
	};

	this.hideAllPages = function () {
		this.pages.forEach((page, index) => {
			page.classList.add(this.classes.hidden);
		});
	};

	this.showStartPage = function () {
		this.pages.forEach((page, index) => {
			if (page.classList.contains(this.classes.startpage)) {
				this.showPage(page);
			}
		});
	};

	this.showPage = function (pageDomObject) {
		let pageid = pageDomObject.getAttribute("id");
		this.pageOpenEventer.fire(pageid);
		this.currentPage = pageDomObject;
		this.animator.setObject(pageDomObject).show();
		this.pagecontainer.scrollTop = 0;
	};

	// Initialisation
	
	this.init = function () {

		return new Promise((resolve, reject) => {

			// Prepare the animators
			this.animator = new Animator("vubn-page-anim-in", "vubn-page-anim-out", this.classes.hidden, true, false, this.useAnimations);

			// Prepare the eventer
			this.pageOpenEventer = new Eventer();
			this.pageLeaveEventer = new Eventer();
			
			// Get the pages and turn into array
			this.pages = document.getElementsByClassName(this.classes.page);
			this.pages = [].slice.call(this.pages);

			this.pagecontainer = document.getElementById(this.classes.pagecontainer);

			this.hideAllPages();
			// Now that the correct page only is displayed, show the container
			this.pagecontainer.classList.remove(this.classes.hidden);
			this.showStartPage();

			// Collect all the navigation links
			let pagelinks = document.getElementsByClassName(this.classes.navigationlink);

			let me = this;

			// Use eventlisteners on every navigation link to make navigation work
			for (let i = 0; i < pagelinks.length; i++) {
				if (vubn.environment === vubn.const.BROWSER) {
					pagelinks[i].addEventListener("click", (event) => {
						event.stopPropagation();
						me.navigatelinkOnClick(event);
					});
				} else {
					pagelinks[i].addEventListener("touchend", (event) => {
						event.stopPropagation();
						me.navigatelinkOnClick(event);
					});
				}
			}

			let drawerlinks = document.querySelectorAll(".mdl-layout__drawer .vubn-navigate-link");
			let drawer = document.getElementsByClassName("mdl-layout")[0];

			// The links in the drawer should make the drawer disappear when clicked.
			for (let i = 0; i < drawerlinks.length; i++) {
				drawerlinks[i].addEventListener("click", (event) => {
					drawer.MaterialLayout.toggleDrawer();
				});
			}

			// Use the 'm' to toggle the drawer.
			document.addEventListener("keyup", (event) => {
				event.stopPropagation();
				if (event.keyCode === 77) {
					//m, M
					drawer.MaterialLayout.toggleDrawer();
				}
			});

			resolve(true);
		});
		
	};

	// Optional constructor code

}


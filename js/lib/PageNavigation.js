"use strict";

function PageNavigation(classDefinitions, isTouch) {

	// Prototype variables
	
	if (! classDefinitions) {
		classDefinitions = {};
	}
	classDefinitions.hidden = classDefinitions.hidden || "hidden";
	classDefinitions.page = classDefinitions.page || "vubn-page";
	classDefinitions.startpage = classDefinitions.startpage || "vubn-startpage";
	classDefinitions.pagecontainer = classDefinitions.pagecontainer || "vubn-pagecontainer";
	classDefinitions.navigationlink = classDefinitions.navigationlink || "vubn-navigate-link";
	classDefinitions.animIn = classDefinitions.animIn || "vubn-page-anim-in";
	classDefinitions.animOut = classDefinitions.animOut || "vubn-page-anim-out";

	isTouch = (isTouch === undefined) ? false : isTouch;
	
	this.pages = null;
	this.classes = classDefinitions;
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
		if (!link || link === "") {
			link = event.currentTarget.getAttribute("data-href");
		}
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
		for (let i = 0; i < this.pages.length; i++) {
			if (this.pages[i].classList.contains(this.classes.startpage)) {
				this.showPage(this.pages[i]);
				break;
			}
		}
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
			this.animator = new Animator(classDefinitions.animIn, classDefinitions.animOut, this.classes.hidden, true, false, this.useAnimations);

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
			let eventType = (isTouch) ? "touchend" : "click";
			for (let i = 0; i < pagelinks.length; i++) {
				pagelinks[i].addEventListener(eventType, (event) => {
					event.stopPropagation();
					me.navigatelinkOnClick(event);
				});
			}

			resolve();
		});
		
	};

	// Optional constructor code

}


"use strict";

function navigatelinkOnClick(event, pages, pageId) {
	let foundPage = false;

	for (let i = 0; i < pages.length; i++) {
		if (pages[i].getAttribute("id") === pageId) {
			hideAllPages(pages);
			showPage(pages[i]);
			foundPage = true;
			break;
		}
	}
	if (! foundPage) {
		throw new Error("The page " + pageId + " could not be found.");
	}
};

function hideAllPages(pages) {
	pages.forEach((page, index) => {
		page.classList.add("hidden");
	});
};

function showStartPage(pages) {
	pages.forEach((page, index) => {
		if (page.classList.contains("vubn-startpage")) {
			page.classList.remove("hidden");
		}
	});
};

function showPage(pageDomObject) {
	pageDomObject.classList.remove("hidden");
};

window.addEventListener("load", (event) => {
	event.stopPropagation;

	// Get the pages and turn into array
	let pages = document.getElementsByClassName("vubn-page");
	pages = [].slice.call(pages);

	hideAllPages(pages);
	showStartPage(pages);

	// Collect all the navigation links
	let pagelinks = document.getElementsByClassName("vubn-navigate-link");

	for (let i = 0; i < pagelinks.length; i++) {
		pagelinks[i].addEventListener("click", (event) => {

			event.stopPropagation();
			// Get the target for every link (minus the '#' at the beginning)
			let link = event.target.getAttribute("href");
			link = link.substring(1, link.length);
			navigatelinkOnClick(event, pages, link);
		});
	}

	let drawerlinks = document.querySelectorAll(".mdl-layout__drawer .vubn-navigate-link");
	let drawer = document.getElementsByClassName("mdl-layout")[0];

	for (let i = 0; i < drawerlinks.length; i++) {
		drawerlinks[i].addEventListener("click", (event) => {
			drawer.MaterialLayout.toggleDrawer();
		});
	}
});

"use strict";

function Templator(idstring) {
	this.domObject = document.getElementById(idstring);

	this.getObject = function () {
		return new Promise((resolve, reject) => {
			resolve(this.domObject.cloneNode(true)); // Deep clone
		});
	};

	// Init code
	
	this.domObject.parentNode.removeChild(this.domObject); // Remove the template from the page
	this.domObject.removeAttribute("id");
}

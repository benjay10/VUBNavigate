"use strict";

function RetreiveService() {
	
	this.getJson = function(url) {
		return this.get(url, "json");
	};

	this.getText = function(url) {
		return this.get(url, "text");
	};

	this.get = function(url, responseType) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("GET", url, true);
			xhr.responseType = responseType;
			xhr.timeout = 20000;
			xhr.onreadystatechange = function () {
				if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
					resolve(xhr.response);
				}
				else if (xhr.readyState === XMLHttpRequest.DONE) {
					reject(xhr.status);
				}
			};
			xhr.send();
		});
	};

	this.init = function () {

	};
}

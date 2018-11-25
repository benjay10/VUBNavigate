"use strict";

this.addEventListener("message", (event) => {
	postMessage([event.data[0], "resultaatSomething"]);
});


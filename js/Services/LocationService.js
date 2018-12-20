"use strict";

function LocationService() {

	// Fields

	this.files = {

	};

	let me = this;

	this.location = null;

	this.receiver = null;

	this.getLocation = function() {
		return new Promise((resolve, reject) => {
			//init quietjs here
			(function() {
				Quiet.init({
					profilesPrefix: "./assets/",
					memoryInitializerPrefix: "./assets/",
					libfecPrefix: "./assets/"
				});

				function onReceive(recvPayload) {
					this.location = Quiet.ab2str(recvPayload);
					console.log("location is: ", this.location);
					me.stopListening();
					resolve(this.location);
				};

				function onReceiverCreateFail(reason) {
					console.log("failed to create quiet receiver: " + reason);
				};

				function onReceiveFail(num_fails) {
					console.log("Failed to receive message: " + num_fails);
				};

				function onQuietReady() {
					console.log("Quiet ready");
					var profilename = "ultrasonic-experimental";
					me.receiver = Quiet.receiver({
						profile: profilename,
						onReceive: onReceive,
						onCreateFail: onReceiverCreateFail,
						onReceiveFail: onReceiveFail
					});
				};

				function onQuietFail(reason) {
					console.log("quiet failed to initialize: " + reason);
				};
				Quiet.addReadyCallback(onQuietReady, onQuietFail);
			})();
		});
	};

	this.stopListening = function() {
		this.receiver.destroy();
	};

	// Init
	this.init = function() {
		//return new Promise((resolve, reject) => {
		//	this.getLocation();
		//});
		return;
	};

}

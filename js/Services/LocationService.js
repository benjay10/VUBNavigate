"use strict";

function LocationService() {

	// Fields

	this.files = {
		libraryPrefix: "./assets/",
		profileName: "ultrasonic-experimental"
	};

	let me = this;

	this.location = null;
	this.receiver = null;
	this.onLocationFoundEventer = null;

	// Methods

	this.onReceive = function (recvPayload) {
		me.location = Quiet.ab2str(recvPayload);
		console.log("Location id is: ", me.location);
		// So this is the most important step. When a location is found, notify all listeners with the location.
		me.onLocationFoundEventer.fire(me.location);
	};

	this.onReceiverCreateFail = function (reason) {
		console.log("Failed to create quiet receiver: " + reason);
	};

	this.onReceiveFail = function (num_fails) {
		console.log("Failed to receive message: " + num_fails);
	};

	this.onQuietReady = function () {
		console.log("Quiet ready");
		me.receiver = Quiet.receiver({
			profile: me.files.profileName,
			onReceive: me.onReceive,
			onCreateFail: me.onReceiverCreateFail,
			onReceiveFail: me.onReceiveFail
		});
	};

	this.onQuietFail = function (reason) {
		console.log("Quiet failed to initialize: " + reason);
	};

	this.startLocation = function () {
		return new Promise((resolve, reject) => {
			Quiet.init({
				profilesPrefix: me.files.libraryPrefix,
				memoryInitializerPrefix: me.files.libraryPrefix,
				libfecPrefix: me.files.libraryPrefix
			});
			Quiet.addReadyCallback(me.onQuietReady, me.onQuietFail);
			resolve();
		});
	};

	this.stopListening = function() {
		this.receiver.destroy();
	};

	// Init
	
	this.init = function() {
		return new Promise((resolve, reject) => {
			this.onLocationFoundEventer = new Eventer();
		});
	};
}


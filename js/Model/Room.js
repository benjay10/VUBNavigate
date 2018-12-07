"use strict";

// Is not necessary. Easier to use the ad-hoc object coming from the datastore than to create objects out of this for every result.

function Room(id, uniformName, legalName, floor, building, type, info, outsideAvailable) {
	this.id = id;
	this.uniformName = uniformName;
	this.legalName = legalName;
	this.floor = floor;
	this.building = building;
	this.info = info;
	this.type = type;
	this.outsideAvailable = outsideAvailable;
}

function Walk(id, from, to, type, info) {
	this.id = id;
	this.from = from;
	this.to = to;
	this.type = type;
	this.info = info;
}

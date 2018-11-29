"use strict";

// Is not necessary. Easier to use the ad-hoc object coming from the datastore than to create objects out of this for every result.

function Room(nodeId, uniformName, legalName, floor, building) {
	this.nodeId = nodeId;
	this.uniformName = uniformName;
	this.legalName = legalName;
	this.floor = floor;
	this.building = building;
}

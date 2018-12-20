"use strict";

function PathFindingService(roomService, locationService) {

	this.graph = null;
	let me = this;

	this.findPath = function(from, to) {
		let shortestPath = me.graph.findShortestPath(from, to);
		return this.getDirectionSteps(shortestPath);
	};

	this.getRoute = function(from, to) {
		return me.graph.getPath(from, to);
	}

	this.getChangeToEast = function(current) {
		var text = null;
		switch (current) {
			case "N":
				text = " Go left."
				break;
			case "S":
				text = " Go right."
				break;
			default:
				text = " Keep straight."
		}
		return text;
	}

	this.getChangeToNorth = function(current) {
		var text = null;
		switch (current) {
			case "W":
				text = " Go left."
				break;
			case "E":
				text = " Go right."
				break;
			default:
				text = " Keep straight."
		}
		return text;
	}

	this.getChangeToSouth = function(current) {
		var text = null;
		switch (current) {
			case "E":
				text = " Go left."
				break;
			case "W":
				text = " Go right."
				break;
			default:
				text = " Keep straight."
		}
		return text;
	}

	this.getChangeToWest = function(current) {
		var text = null;
		switch (current) {
			case "S":
				text = " Go left."
				break;
			case "N":
				text = " Go right."
				break;
			default:
				text = " Keep straight."
		}
		return text;
	}
	this.getDirectionSteps = function(shortestPath) {
		var routeSegments = [];
		var promises = [];

		var from = shortestPath.shift();
		for (var to; to = shortestPath.shift();) {
			var room = roomService.getRoom(parseInt(to))
			promises.push(room);

			var route = this.getRoute(from, to);
			routeSegments.push(route)

			from = to;
		}

		return Promise.all(promises).then(function(rooms) {

			var current_dir = locationService.getDir(); //TODO: still needs to be checked which dir1/2 needs to be taken
			var texts = [];
			routeSegments.forEach(function(route, index) {
				var text = "";

			if(rooms[index].id != from) {
				switch(route.type) {
					case "corridor":
						text = "Walk through the corridor ";
						break;
					case "lift":
						text = "Take the elevator";
						break;
					default:
						text = "";
				}

					switch (rooms[index].type) {
						case "office":
							text += "passing office " + rooms[index].legalName;
							break;
						case "lift":
							text += rooms[index].legalName;
							break;
						case "landing":
							text += rooms[index].legalName;
							break;
						case "classroom":
							text += "passing classroom " + rooms[index].legalName;
							break;
						case "maintenance":
							text += "passing maintenance room " + rooms[index].legalName;
							break;
						default:
							text += rooms[index].type;
					}

					switch (rooms[index].wind_dir) {
						case "N":
							text += me.getChangeToNorth(current_dir);
							current_dir = rooms[index].wind_dir;
							break;
						case "E":
							text += me.getChangeToEast(current_dir);
							current_dir = rooms[index].wind_dir;
							break;
						case "S":
							text += me.getChangeToSouth(current_dir);
							current_dir = rooms[index].wind_dir;
							break;
						case "W":
							text += me.getChangeToWest(current_dir);
							current_dir = rooms[index].wind_dir;
							break;
					}

					if (rooms[index].outsideAvailable.length > 0) {
						text += ". You should be able to see the following: " + rooms[index].outsideAvailable.join(", ") + ".";
					}
				} else {
					text += "You will now arrive at your destination, ";
					switch (rooms[index].type) {
						case "office":
							text += "office " + rooms[index].legalName;
							break;
						case "lift":
							text += rooms[index].legalName;
							break;
						case "landing":
							text += rooms[index].legalName;
							break;
						case "classroom":
							text += "classroom " + rooms[index].legalName;
							break;
						case "maintenance":
							text += "maintenance room " + rooms[index].legalName;
							break;
						default:
							text += rooms[index].type;
					}
				}
				texts.push(text);
			});

			return texts;
		});
	}

	this.getHumanNavigation = function(routeSegments) {

	};

	this.buildGraph = function() {

		roomService.getAllWalksForGraph().then((edges) => {
			let map = {};

			edges.forEach((edge) => {
				let from = edge.from;
				let to = edge.to;
				let weight = edge.weight;
				let type = edge.type;
				let info = edge.info;

				if (!(edge.from in map))
					map[edge.from] = {};

				map[from][to] = {
					cost: weight,
					type: type,
					info: info
				};
			});

			me.graph = new Graph(map);

		});
	};

	this.init = function() {
		return new Promise((resolve, reject) => {
			me.buildGraph();
		});
	};
}

// {23: {22:1, 21: 2, 24:3}, 30: {} }

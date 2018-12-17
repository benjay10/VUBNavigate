"use strict";

function PathFindingService(roomService) {

	this.graph = null;
	let me = this;

	this.findPath = function (from, to) {
		let shortestPath = me.graph.findShortestPath(from, to);
		return this.getDirectionSteps(shortestPath);
	};

	this.getRoute = function (from, to) {
		return me.graph.getPath(from, to);
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

			var texts = [];
			routeSegments.forEach(function(route, index) {
				var text = "";

				switch(route.type) {
				  case "corridor":
				    text = "Loop in de gang voorbij ";
				    break;
				  case "lift":
				    text = "Neem de lift";
				    break;
				  default:
				    text = "";
				}

				switch(rooms[index].type) {
				  case "office":
				    text += "bureau "+rooms[index].legalName;
				    break;
				  case "lift":
				    text += rooms[index].legalName;
				    break;
				  default:
				    text += "";
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

			    map[from][to] = {cost: weight, type:type, info:info};
			});

			me.graph = new Graph(map);

		});
	};

	this.init = function () {
		return new Promise((resolve, reject) => {
			me.buildGraph();
		});
	};
}


// {23: {22:1, 21: 2, 24:3}, 30: {} }
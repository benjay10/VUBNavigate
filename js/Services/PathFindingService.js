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

		var from = shortestPath.shift();
		for (var to; to = shortestPath.shift();) {
		    routeSegments.push(me.getRoute(from, to))
		    from = to;
		}
		return routeSegments;
	}

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
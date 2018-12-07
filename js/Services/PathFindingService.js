"use strict";

function PathFindingService(roomService) {

	this.graph = null;
	let me = this;

	this.findPath = function (from, to) {
		return me.graph.findShortestPath(from, to);
	};

	this.buildGraph = function() {

		roomService.getAllWalksForGraph().then((edges) => {
			let map = {};

			edges.forEach((edge) => {
				let from = edge.from;
				let to = edge.to;
				let weight = edge.weight;

			    if (!(edge.from in map)) 
			    	map[edge.from] = {};

			    map[from][to] = weight;
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


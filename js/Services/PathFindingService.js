"use strict";

function PathFindingService(roomService) {

	this.graph = null;
	let me = this;

	this.findPath = function (from, to) {
		return me.graph.findShortestPath(from, to);
	};

	this.getRoute = function (from, to) {
		return me.graph.getPath(from, to);
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
"use strict";

function PathFindingService(roomService) {

	this.graph = null;
	let me = this;



	this.findPath = function (from, to) {
		console.log(me);
		return me.graph.findShortestPath(from, to);
	};


	this.buildGraph = function() {
		console.log("pathfinding creation started");
		console.log(roomService);
		roomService.getAllWalksForGraph().then((edges) => {
			let map = {};

			for (var i = 0; i < edges.length; i++) {
				let edge = edges[i];
				let from = edge.from;
				let to = edge.to;
				let weight = edge.weight;

			    if (!(edge.from in map)) 
			    	map[edge.from] = {};

			    map[from][to] = weight;
			}

			me.graph = new Graph(map);
			console.log(map);
			console.log("pathfinding creation success");

		});
		
	};



	this.init = function () {

		return new Promise((resolve, reject) => {
			me.buildGraph();
			
		});
		
	};
	
}

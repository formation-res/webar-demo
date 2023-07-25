import { WeightedGraph } from "./WeightedGraph.js"

/* 
        TEST CASES FOR THE WEIGHTEDGRAPH CLASS
*/


let Waypoints = {};     //sample data
Waypoints["point1"] = {name: "Bathroom", lat: 40, long: 50};
Waypoints["point2"] = {name: "Door2", lat: 30, long: 40};
Waypoints["point3"] = {name: "hallway 8", lat: 20, long: 30};
Waypoints["point4"] = {name: "main entrance", lat: 10, long: 20};
Waypoints["point5"] = {name: "emergency exit", lat: 0, long: 10};

const g1 = new WeightedGraph();
//create a graph with verticies of the waypoint IDs (unique)
for (var key in Waypoints)   {g1.addVertex(key); }



const graph = new WeightedGraph();
const g = new WeightedGraph();

for (let i = 0; i < 6; i++) {
  g.addVertex(i);
}
g.addEdge(0, 1, 7);
g.addEdge(0, 2, 9);
g.addEdge(0, 5, 14);
g.addEdge(1, 2, 10);
g.addEdge(1, 3, 15);
g.addEdge(2, 3, 11);
g.addEdge(2, 5, 2);
g.addEdge(3, 4, 6);
g.addEdge(4, 5, 9);

console.log(g.findShortestPath(0, 1)); // Output: [ 0, 1 ]
console.log(g.findShortestPath(0, 4)); // Output: [0, 2, 5, 4]


graph.addEdge('A', 'B', 4);
graph.addEdge('A', 'C', 2);
graph.addEdge('B', 'E', 3);
graph.addEdge('C', 'D', 2);
graph.addEdge('C', 'F', 4);
graph.addEdge('D', 'E', 3);
graph.addEdge('D', 'F', 1);
graph.addEdge('E', 'F', 1);

const shortestPath = graph.findShortestPath('A', 'E');
console.log('Shortest path:', shortestPath); // Output: Shortest path: [ 'A', 'C', 'D', 'E' ]
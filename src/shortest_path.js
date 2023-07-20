import { WeightedGraph } from "./Classes/WeightedGraph.js"

/*  Waypoints is a list of dictionaries, where each Waypoint represents a vertex in the graph.
- the index is the name of the vertex in the WeightedGraph
- coordinates, name, and ID can be obtained by this reference.
- Waypoints[0] = the 0 vertex in the graph. by convention, the graph will had verticies names after integers 
- every time a waypoint is added, we add it to Waypoints[], and we can then add it to the WeightedGraph, G, as well.
*/
let Waypoints = [];
Waypoints.push( {name: "wp1", lat: 40, long: 50, ID: "0xFFAB"})
Waypoints.push( {name: "wp2", lat: 30, long: 40, ID: "0xFFBC"})
Waypoints.push( {name: "wp3", lat: 20, long: 30, ID: "0xFFCD"})
//sample data

console.log(Waypoints); //test

// Example graph usage:
const g = new WeightedGraph();

g.addVertex(0)  //a         //wp1
g.addVertex(1)  //b         //wp2
g.addVertex(2)  //c         //wp3
g.addVertex(3)  //d
g.addVertex(4)  //e
g.addVertex(5)  //f

g.addEdge(0, 1, 7)  
g.addEdge(0, 2, 9)
g.addEdge(0, 5, 14)
g.addEdge(1, 2, 10)
g.addEdge(1, 3, 15)
g.addEdge(2, 3, 11)
g.addEdge(2, 5, 2)
g.addEdge(3, 4, 6)
g.addEdge(4, 5, 9)

console.log(g.adjacencyList);   //prints the entire graph
// g.printVertices();              //just prints the verticies



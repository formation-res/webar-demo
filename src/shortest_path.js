import { WeightedGraph } from "./Classes/WeightedGraph.js"

/* 

Do I want to store the graphs in a database? If it was integrated into Formation, they would create a new database subset for the waypoints.

Like this, how do we search for waypoints? we have a dictionary to translate string ID --> index
*/




/*  Waypoints is a list of dictionaries, where each Waypoint represents a vertex in the graph.
- the ID is the name of the vertex in the WeightedGraph
- coordinates, name, and other properties can be obtained by this reference.
- every time a waypoint is added, we add it to Waypoints[], and we can then add it to the WeightedGraph, G, as well.
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




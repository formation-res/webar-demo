import { WeightedGraph } from "./Classes/WeightedGraph.js"
import { json_str } from "./icon_data.js";

var points_collection = JSON.parse(json_str);
/* 
Do I want to store the graphs in a database? If it was integrated into Formation, they would create a new database subset for the waypoints.

Like this, how do we search for waypoints? we have a dictionary to translate string ID --> index
*/

/*  Waypoints is a list of dictionaries, where each Waypoint represents a vertex in the graph.
- the ID is the name of the vertex in the WeightedGraph
- coordinates, name, and other properties can be obtained by this reference.
- every time a waypoint is added, we add it to Waypoints[], and we can then add it to the WeightedGraph, G, as well.
*/


let Waypoints = {};

for (var i = 0; i < points_collection.length; i++) { 
    Waypoints[points_collection[i].id] = {title: points_collection[i].title, lat: points_collection[i].lat, long: points_collection[i].long};
}

// console.log(Waypoints);
 
//create graph based on input data.


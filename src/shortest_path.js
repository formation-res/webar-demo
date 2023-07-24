import { WeightedGraph, distanceBetweenPoints } from "./Classes/WeightedGraph.js"
import { json_str } from "./icon_data.js";

const startingPOI = 'b7nHb34SwJn3S5oXkEh0vQ';       //install formation app
const destinationPOI = 'UGe5iM8v-j1LDaJSuXK3Jw';    //coffee machine

var points_collection = JSON.parse(json_str);
const g = new WeightedGraph();

let Waypoints = {};     // NOTE : : : icon_data will NOT be used for the waypoints in real version.
for (var i = 0; i < points_collection.length; i++) 
    { 
        Waypoints[points_collection[i].id] = {title: points_collection[i].title, lat: points_collection[i].lat, long: points_collection[i].long, x: points_collection[i].x, y: points_collection[i].y};
        g.addVertex(points_collection[i].id)
    }

    //make simple graph.
    for (var i = 0; i < points_collection.length; i++) 
    { 
        for (var j = 0; j < 1 + Math.floor(Math.random()* (points_collection.length/3)) ; j++)  
        {
            // adds edge, for each vertex, with 1-2 other random verticies.
            let randomNum = Math.floor( Math.random() * points_collection.length );
            let distance = distanceBetweenPoints(points_collection[i].x, points_collection[i].y, points_collection[randomNum].x, points_collection[randomNum].y );
            g.addEdge(points_collection[i].id, points_collection[randomNum].id, distance);
        }
        
    }


export const waypoint_path = g.findShortestPath(points_collection[0].id, points_collection[4].id);
console.log(waypoint_path)
//obtain these by input. will use these to choose vertex1 and vertex2. 
//for now make it choose the closest one. 

//this is what will be displayed on the AR screen.
const complete_path = waypoint_path + destinationPOI;
import { WeightedGraph, distanceBetweenPoints } from "./Classes/WeightedGraph.js"
import { json_str } from "./data/icon_data.js";
import { waypoints_raw } from "./data/waypoints_dump.js";
import { readFileSync } from 'fs';

const jsonData = JSON.parse(readFileSync('./src/config.json', 'utf-8'));
const starting_id = jsonData.STARTING_POI;
const destination_id = jsonData.DESTINATION_POI;
    

//this makes it in better format with just the hits we want. 
// console.log(waypoints_raw.data.search.hits.)

const hits = waypoints_raw.data.search.hits;

//use it like this to access things. 
console.log(hits[0].hit.color)

// Loop through the hits and print the color of each hit
hits.forEach((hit, index) => {
  const color = hit.hit.color;
  //console.log(`Hit ${index + 1} color: ${color}`);
});

//need to convert these to X and Y relative from where we are starting. I can then just put them in 'points collection' in render_objects.js



var points_collection = JSON.parse(json_str);
const g = new WeightedGraph();

// let Waypoints = {};     // NOTE : : : icon_data will NOT be used for the waypoints in real version.
// for (var i = 0; i < points_collection.length; i++) 
//     { 
//         Waypoints[points_collection[i].id] = {title: points_collection[i].title, lat: points_collection[i].lat, long: points_collection[i].long, x: points_collection[i].x, y: points_collection[i].y};
//         g.addVertex(points_collection[i].id)
//     }

//     //make simple graph.
//     for (var i = 0; i < points_collection.length; i++) 
//     { 
//         for (var j = 0; j < 1 + Math.floor(Math.random()* (points_collection.length/3)) ; j++)  
//         {
//             // adds edge, for each vertex, with 1-2 other random verticies.
//             let randomNum = Math.floor( Math.random() * points_collection.length );
//             let distance = distanceBetweenPoints(points_collection[i].x, points_collection[i].y, points_collection[randomNum].x, points_collection[randomNum].y );
//             g.addEdge(points_collection[i].id, points_collection[randomNum].id, distance);
//         }
        
//     }


// export const waypoint_path = g.findShortestPath(points_collection[0].id, points_collection[4].id);
// //console.log(waypoint_path)
// //obtain these by input. will use these to choose vertex1 and vertex2. 
// //for now make it choose the closest one. 

// //this is what will be displayed on the AR screen.
// const complete_path = waypoint_path + destinationPOI;
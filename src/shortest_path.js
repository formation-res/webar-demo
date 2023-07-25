import { WeightedGraph, distanceBetweenPoints, findAngle} from "./Classes/WeightedGraph.js"
import { json_str } from "./data/icon_data.js";
import { waypoints_raw } from "./data/waypoints_dump.js";
import { inverseVincentyDistance, calculateBearing, degreesToRadians} from "./Classes/Geo.js";
import { readFileSync } from 'fs';


const hits = waypoints_raw.data.search.hits;
var points_collection = JSON.parse(json_str);
const g = new WeightedGraph();

const jsonData = JSON.parse(readFileSync('./src/config.json', 'utf-8'));
const starting_id = jsonData.STARTING_POI;
const destination_id = jsonData.DESTINATION_POI;


let origin = {};
//extract origin. currently points_collections reperesents OUR database, which is a subset from original excel.
for (var i = 0; i < points_collection.length; i++) {
    if (points_collection[i].id === starting_id){
        origin = {lat : points_collection[i].lat, lng : points_collection[i].long }
        //console.log(origin);
    }
}


let Waypoints = {};    
for (var i = 0; i < hits.length; i++) 
    { 
        Waypoints[hits[i].hit.id] = {title: hits[i].hit.title, color : hits[i].hit.color , lat: hits[i].hit.latLon.lat, long: hits[i].hit.latLon.lon, description: hits[i].hit.description, x : Infinity, y : Infinity, distance : Infinity, angle : Infinity};
        g.addVertex(hits[i].hit.id)
        //for each ID add a vertex that corresponds with this waypoint.
        //we will have to MANUALLY add the edges.........
    }
// console.log(Waypoints)


//insert the x and y values into the waypoints that are relative to the STARTING ID.
for (const element in Waypoints) {
   let p1 = {lat : Waypoints[element].lat, lng : Waypoints[element].long } ;

    let distance = inverseVincentyDistance(origin, p1);
    let angle = calculateBearing(origin.lat, origin.lng, Waypoints[element].lat, Waypoints[element].long);
    Waypoints[element].distance = distance;
    Waypoints[element].angle = angle;
    Waypoints[element].x = distance * Math.cos( degreesToRadians(angle) );
    Waypoints[element].y = distance * Math.cos( degreesToRadians(angle) );
    // console.log(`x: ${Waypoints[element].x}`, `y: ${Waypoints[element].y}`)
}   

export const waypoint_collection = Waypoints;






















    // //make simple graph.
    // for (var i = 0; i < .length; i++) 
    // { 
    //     for (var j = 0; j < 1 + Math.floor(Math.random()* (points_collection.length/3)) ; j++)  
    //     {
    //         // adds edge, for each vertex, with 1-2 other random verticies.
    //         let randomNum = Math.floor( Math.random() * points_collection.length );
    //         let distance = distanceBetweenPoints(points_collection[i].x, points_collection[i].y, points_collection[randomNum].x, points_collection[randomNum].y );
    //         g.addEdge(points_collection[i].id, points_collection[randomNum].id, distance);
    //     }
        
    // }


// export const waypoint_path = g.findShortestPath(points_collection[0].id, points_collection[4].id);
//console.log(waypoint_path)
//obtain these by input. will use these to choose vertex1 and vertex2. 
//for now make it choose the closest one. 

//this is what will be displayed on the AR screen.
// const complete_path = waypoint_path + destinationPOI;


    // let p1 = {lat : hits[0].hit.latLon.lat, lng : hits[0].hit.latLon.lon } 
    // let p2 = {lat : hits[1].hit.latLon.lat, lng : hits[1].hit.latLon.lon } 
    // console.log(inverseVincentyDistance(p1,p2))
    // let pointA = { lat: 52.5200, lng: 13.4050 } // Berlin, Germany
    // let pointB = { lat: 48.8566, lng: 2.3522 }  // Paris, France
    // expectedDistance: 559422.127 Distance in meters (approximately)
    // console.log(inverseVincentyDistance(pointA,pointB))
import { distVincenty,degreesToRadians,radiansToDegrees } from "./src/Classes/Geo.js";
import { WeightedGraph} from "./src/Classes/WeightedGraph.js";
import { json_str } from "./src/data/icon_data.js";
import { json_str_wp } from "./src/data/waypoint_dump.js";
import { Rooms } from "./src/Classes/rooms.js";


import express from 'express';
import https from 'https'
import fs from 'fs'
import pathh from 'path';


const __dirname = pathh.dirname(new URL(import.meta.url).pathname);

const app = express();
const port = process.env.PORT || 5173;

// Parse incoming JSON data
app.use(express.json());

// Serve index.html
app.use(express.static(pathh.join(__dirname, '.')));

app.post('/shortest_path', (req, res) => {
  const dataFromClient = req.body.message;
  console.log('Data received from client:', dataFromClient[0]);

  // Process the data and generate final_path

extractOrigin(dataFromClient[0], dataFromClient[1]);
fillWaypoints();
generateEdges(g);

res.json( getPath() ); // Respond with the result
});

app.listen(port,'0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});






// console.log(Rooms);
// Based on waypoints in FORMATION demo. fetched from formation.
const hits = JSON.parse(json_str_wp);


//Based on all the data points we have (currently just the subset in the excell spreadsheet).
var points_collection = JSON.parse(json_str);
const g = new WeightedGraph();

//----------------------------------------------------------------------------------------------------------------------------------
//want to make user input with formation API. Use Athena's results

const starting_id = "b7nHb34SwJn3S5oXkEh0vQ";   //starting POI              == install the app
// const starting_id = "kzbVqke3CHYwdAB5e9nhqA";   //starting POI              ==  desk 4
const destination_id = "oPkKfi1FpX2As_BOVvBRyQ";  //final destination POI   == filter coffee machine

//----------------------------------------------------------------------------------------------------------------------------------
let origin = {};          //initial coordinates
let destination = {};     //destination coordinates
let Waypoints = {};
let first_waypoint;
let last_waypoint;
var min_dist_start = Infinity;      //eventually will be starting_POI --> first_waypoint.
let min_dist_end = Infinity;        //eventually last_waypoint --> destination_POI

let path = [];
let totalDistance;
let path_points = []


 function extractOrigin(starting_id, destination_id) {
  //extract origin. currently points_collections represents OUR database, which is a subset from the original excel.
  //console.log(starting_id);
  for (var i = 0; i < points_collection.length; i++) {
    if (points_collection[i].id === starting_id) {
      origin = { lat: points_collection[i].lat, long: points_collection[i].long };
      //console.log("Origin found!");
    }
    if (points_collection[i].id === destination_id) {
      destination = { lat: points_collection[i].lat, long: points_collection[i].long, x : Infinity, y : Infinity, color : points_collection[i].color };
      //console.log("destination found!");
    }
  }
}

 function fillWaypoints() {
  for (var i = 0; i < hits.length; i++) {
    Waypoints[hits[i].hit.id] = {
      title: hits[i].hit.title,
      color: hits[i].hit.color,
      lat: hits[i].hit.latLon.lat,
      long: hits[i].hit.latLon.lon,
      description: hits[i].hit.description,
      x: Infinity,
      y: Infinity,
      distance: Infinity,
      angle: Infinity
    };
    g.addVertex(hits[i].hit.id);
    //for each ID add a vertex that corresponds with this waypoint.
  }


  //insert the x and y values into the waypoints that are relative to the STARTING ID.
  for (const element in Waypoints) {
    let res = distVincenty(origin.lat, origin.long, Waypoints[element].lat, Waypoints[element].long)
    let distance = res['distance'];
    let angle = res['initialBearing']
    //console.log(`distance: ${distance} and bearing: ${angle}.`)
    Waypoints[element].distance = distance;
    Waypoints[element].angle = angle;
    Waypoints[element].x = distance * Math.sin(degreesToRadians(angle));  //east
    Waypoints[element].y = distance * Math.cos(degreesToRadians(angle));  //north
    //console.log(`title: ${Waypoints[element].title}` , `x: ${Waypoints[element].x}`, `y: ${Waypoints[element].y}`, `angle: ${angle}`)


    //ADD CHECKS HERE TO SEE IF IN SAME ROOM? or the like !!!!!! -------------------------------------------------------------
    //check for closest waypoint to start. 


    //console.log(`Distance: ${distance}  min_dist_start: ${min_dist_start} `)
    if ( (min_dist_start - distance) > 0) {
      min_dist_start = distance;
      first_waypoint = element;
    }

    //check for closest waypoint to FINAL destination.
    let res2 = distVincenty(destination.lat, destination.long, Waypoints[element].lat, Waypoints[element].long)
    let distance2 = res2['distance'];   //for the END POINT distance only
    if  (distance2 < min_dist_end) {
      min_dist_end = distance2;
      last_waypoint = element;
    }

  }
// console.log(Waypoints);


//adding coordinates for the destination point
let res = distVincenty(origin.lat, origin.long, destination.lat, destination.long)
    let distance = res['distance'];
    let angle = res['initialBearing']
    destination.y =  distance * Math.cos(degreesToRadians(angle));  //this represents NORTH.
    destination.x = distance * Math.sin(degreesToRadians(angle));   // EAST
}

 function getPath() {
  let result = g.findShortestPath(first_waypoint, last_waypoint);
  if (result) {
    path = result.path;
    totalDistance = result.totalDistance;
    path.push(destination_id);
    path.unshift(starting_id);  
    // console.log(Waypoints[first_waypoint], Waypoints[last_waypoint]);


    //translate path into a list of points. 
    for (var i = 1; i < path.length-1; i++){    // MISSING start and end coordinates
      let id = path[i]
      path_points.push( {x: Waypoints[id].x, y: Waypoints[id].y, title: Waypoints[id].title} )  //push a coordinate point based on the ID.
    }

    path_points.unshift({x : 0, y : 0}) //start point is always the origin
    path_points.push( {x : destination.x, y : destination.y } )  //pushing the destination coords
    
  }
  else {
    path = null;
  }
  return path_points;
}

 function generateEdges(g) {
  for (const element in Waypoints){

    if (element === "sK_AvPfFzIlFm5yrdP_mBQ")   { //waypoint 2
      const lat = Waypoints[element].lat;
      const long = Waypoints[element].long;
      const connections = ["PpvGjpxbS56-Gmymffxt8g", "Jf4oujbxDxty4o9rTdLWkA", "8M-V4tmK7B0ycDADY2QhaA", 
                           "5zUZUZfOyG_yI9dsyNPXRA", "s7pI1GTGz-p_DaxCHmtoVQ", "9PqPhP1AslO_L2RAeZuyFw", 
                           "JAb_7VFKSIwsMUTVVU3QjQ", "DNkhxAlFtI6t9I1FYnCQRQ", "SA0Z4KQH_zA81fQfrfD6AA"];

      for (var i = 0; i < connections.length; i++){   //adds all edges
        const id = connections[i];
        g.addEdge(element, id, distVincenty(lat, long, Waypoints[id].lat, Waypoints[id].long)["distance"])
      }
    }


    if (element === "PpvGjpxbS56-Gmymffxt8g")   { //waypoint 1
      const lat = Waypoints[element].lat;
      const long = Waypoints[element].long;
      const connections = ["PpvGjpxbS56-Gmymffxt8g", "Jf4oujbxDxty4o9rTdLWkA", "8M-V4tmK7B0ycDADY2QhaA", 
                           "5zUZUZfOyG_yI9dsyNPXRA", "s7pI1GTGz-p_DaxCHmtoVQ", "9PqPhP1AslO_L2RAeZuyFw", 
                           "DNkhxAlFtI6t9I1FYnCQRQ", "SA0Z4KQH_zA81fQfrfD6AA"];

      for (var i = 0; i < connections.length; i++){   //adds all edges
        const id = connections[i];
        g.addEdge(element, id, distVincenty(lat, long, Waypoints[id].lat, Waypoints[id].long)["distance"])
      }
    }


    if (element === "Prle_dqgn0nZFRvHMkhReA")   { //waypoint 4
      const lat = Waypoints[element].lat;
      const long = Waypoints[element].long;
      const connections = ["Jf4oujbxDxty4o9rTdLWkA"];

      for (var i = 0; i < connections.length; i++){   //adds all edges
        const id = connections[i];
        g.addEdge(element, id, distVincenty(lat, long, Waypoints[id].lat, Waypoints[id].long)["distance"])
      }
    }


    if (element === "Jf4oujbxDxty4o9rTdLWkA")   { //waypoint 3
      const lat = Waypoints[element].lat;
      const long = Waypoints[element].long;
      const connections = ["PpvGjpxbS56-Gmymffxt8g", "Jf4oujbxDxty4o9rTdLWkA", "8M-V4tmK7B0ycDADY2QhaA", 
      "5zUZUZfOyG_yI9dsyNPXRA", "s7pI1GTGz-p_DaxCHmtoVQ", "9PqPhP1AslO_L2RAeZuyFw", 
      "DNkhxAlFtI6t9I1FYnCQRQ", "SA0Z4KQH_zA81fQfrfD6AA", "JAb_7VFKSIwsMUTVVU3QjQ"];

      for (var i = 0; i < connections.length; i++){   //adds all edges
        const id = connections[i];
        g.addEdge(element, id, distVincenty(lat, long, Waypoints[id].lat, Waypoints[id].long)["distance"])
      }
    }


    if (element === "pp93HatKOfganUXN32jLXA")   { //waypoint_demo 6
      const lat = Waypoints[element].lat;
      const long = Waypoints[element].long;
      const connections = ["5zUZUZfOyG_yI9dsyNPXRA"];

      for (var i = 0; i < connections.length; i++){   //adds all edges
        const id = connections[i];
        g.addEdge(element, id, distVincenty(lat, long, Waypoints[id].lat, Waypoints[id].long)["distance"])
      }
    }


    if (element === "5zUZUZfOyG_yI9dsyNPXRA")   { //waypoint_demo 5
      const lat = Waypoints[element].lat;
      const long = Waypoints[element].long;
      const connections = ["8M-V4tmK7B0ycDADY2QhaA", "s7pI1GTGz-p_DaxCHmtoVQ", "9PqPhP1AslO_L2RAeZuyFw", "JAb_7VFKSIwsMUTVVU3QjQ", "3fyYY6wSlAMQpcziVH1Zhg"];

      for (var i = 0; i < connections.length; i++){   //adds all edges
        const id = connections[i];
        g.addEdge(element, id, distVincenty(lat, long, Waypoints[id].lat, Waypoints[id].long)["distance"])
      }
    }


    if (element === "5zUZUZfOyG_yI9dsyNPXRA")   { //waypoint_demo 7
      const lat = Waypoints[element].lat;
      const long = Waypoints[element].long;
      const connections = ["8M-V4tmK7B0ycDADY2QhaA", "s7pI1GTGz-p_DaxCHmtoVQ", "9PqPhP1AslO_L2RAeZuyFw", "JAb_7VFKSIwsMUTVVU3QjQ", "3fyYY6wSlAMQpcziVH1Zhg"];

      for (var i = 0; i < connections.length; i++){   //adds all edges
        const id = connections[i];
        g.addEdge(element, id, distVincenty(lat, long, Waypoints[id].lat, Waypoints[id].long)["distance"])
      }
    }


    if (element === "9PqPhP1AslO_L2RAeZuyFw")   { //waypoint_demo 8
      const lat = Waypoints[element].lat;
      const long = Waypoints[element].long;
      const connections = ["8M-V4tmK7B0ycDADY2QhaA", "s7pI1GTGz-p_DaxCHmtoVQ", "9PqPhP1AslO_L2RAeZuyFw", "JAb_7VFKSIwsMUTVVU3QjQ", "3fyYY6wSlAMQpcziVH1Zhg"];

      for (var i = 0; i < connections.length; i++){   //adds all edges
        const id = connections[i];
        g.addEdge(element, id, distVincenty(lat, long, Waypoints[id].lat, Waypoints[id].long)["distance"])
      }
    }


    if (element === "JAb_7VFKSIwsMUTVVU3QjQ")   { //waypoint_demo 9
      const lat = Waypoints[element].lat;
      const long = Waypoints[element].long;
      const connections = ["8Pcs7hWZ6EqaGCZc5rMnbQ", "8M-V4tmK7B0ycDADY2QhaA", "3fyYY6wSlAMQpcziVH1Zhg"];

      for (var i = 0; i < connections.length; i++){   //adds all edges
        const id = connections[i];
        g.addEdge(element, id, distVincenty(lat, long, Waypoints[id].lat, Waypoints[id].long)["distance"])
      }
    }


    if (element === "8M-V4tmK7B0ycDADY2QhaA")   { //waypoint_middle
      const lat = Waypoints[element].lat;
      const long = Waypoints[element].long;
      const connections = ["3fyYY6wSlAMQpcziVH1Zhg"];

      for (var i = 0; i < connections.length; i++){   //adds all edges
        const id = connections[i];
        g.addEdge(element, id, distVincenty(lat, long, Waypoints[id].lat, Waypoints[id].long)["distance"])
      }
    }


    if (element === "DNkhxAlFtI6t9I1FYnCQRQ")   { //waypoint_center_left
      const lat = Waypoints[element].lat;
      const long = Waypoints[element].long;
      const connections = ["SA0Z4KQH_zA81fQfrfD6AA", "8Pcs7hWZ6EqaGCZc5rMnbQ"];

      for (var i = 0; i < connections.length; i++){   //adds all edges
        const id = connections[i];
        g.addEdge(element, id, distVincenty(lat, long, Waypoints[id].lat, Waypoints[id].long)["distance"])
      }
    }


    if (element === "SA0Z4KQH_zA81fQfrfD6AA")   { //WP_pod_rooms
      const lat = Waypoints[element].lat;
      const long = Waypoints[element].long;
      const connections = ["8Pcs7hWZ6EqaGCZc5rMnbQ"];

      for (var i = 0; i < connections.length; i++){   //adds all edges
        const id = connections[i];
        g.addEdge(element, id, distVincenty(lat, long, Waypoints[id].lat, Waypoints[id].long)["distance"])
      }
    }


    if (element === "7UWclg7NYhPtbPvzgfiPtg")   { //waypoint female WC
      const lat = Waypoints[element].lat;
      const long = Waypoints[element].long;
      const connections = ["3fyYY6wSlAMQpcziVH1Zhg"]
      for (var i = 0; i < connections.length; i++){   //adds all edges to waypoint femaleWC.
        const id = connections[i];
        g.addEdge(element, id, distVincenty(lat, long, Waypoints[id].lat, Waypoints[id].long)["distance"])
      }
    }


  if (element === "nuItd28dpxpJfZKep_Wx0Q")   { //waypoint men WC
      const lat = Waypoints[element].lat;
      const long = Waypoints[element].long;
      const connections = ["3fyYY6wSlAMQpcziVH1Zhg"]
      for (var i = 0; i < connections.length; i++){   //adds all edges to waypoint men WC.
        const id = connections[i];
        g.addEdge(element, id, distVincenty(lat, long, Waypoints[id].lat, Waypoints[id].long)["distance"])
      }
    }


  if (element === "3fyYY6wSlAMQpcziVH1Zhg")   { //waypoint demo 1a
      const lat = Waypoints[element].lat;
      const long = Waypoints[element].long;
      const connections = ["7UWclg7NYhPtbPvzgfiPtg", "nuItd28dpxpJfZKep_Wx0Q", "JAb_7VFKSIwsMUTVVU3QjQ",
                           "9PqPhP1AslO_L2RAeZuyFw", "s7pI1GTGz-p_DaxCHmtoVQ", "5zUZUZfOyG_yI9dsyNPXRA",
                           "8M-V4tmK7B0ycDADY2QhaA"]
      for (var i = 0; i < connections.length; i++){   //adds all edges to waypoint demo 1a.
        const id = connections[i];
        g.addEdge(element, id, distVincenty(lat, long, Waypoints[id].lat, Waypoints[id].long)["distance"])
      }
    }
  }   //end element loop
} //end function


// extractOrigin(starting_id, destination_id);
// fillWaypoints();
// generateEdges(g);
// console.log(getPath() );

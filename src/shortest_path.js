import { distVincenty,degreesToRadians,radiansToDegrees } from "./Classes/Geo.js";
import { WeightedGraph, findAngle} from "./Classes/WeightedGraph.js";
import { json_str } from "./data/icon_data.js";
import { waypoints_raw } from "./data/waypoints_dump.js";


const hits = waypoints_raw.data.search.hits;
var points_collection = JSON.parse(json_str);
const g = new WeightedGraph();
const starting_id = "b7nHb34SwJn3S5oXkEh0vQ";
const destination_id = "UGe5iM8v-j1LDaJSuXK3Jw";

function generateEdges(g) {
  for (const element in Waypoints){

    if (element === "sK_AvPfFzIlFm5yrdP_mBQ")   { //waypoint 2
      const lat = Waypoints[element].lat;
      const long = Waypoints[element].long;
      const connections = ["PpvGjpxbS56-Gmymffxt8g", "Jf4oujbxDxty4o9rTdLWkA", "8M-V4tmK7B0ycDADY2QhaA", 
                           "5zUZUZfOyG_yI9dsyNPXRA", "s7pI1GTGz-p_DaxCHmtoVQ", "9PqPhP1AslO_L2RAeZuyFw", 
                           "JAb_7VFKSIwsMUTVVU3QjQ", "DNkhxAlFtI6t9I1FYnCQRQ", "SA0Z4KQH_zA81fQfrfD6AA"]

      for (var i = 0; i < connections.length; i++){   //adds all edges to waypoint 2. 
        const id = connections[i];
        g.addEdge(element, id, distVincenty(lat, long, Waypoints[id].lat, Waypoints[id].long)["distance"])
      }
    }
    



  }   //end element loop
} //end function


  //extract origin. currently points_collections represents OUR database, which is a subset from the original excel.
  let origin = {};
  //console.log(starting_id);
  for (var i = 0; i < points_collection.length; i++) {
    if (points_collection[i].id === starting_id) {
      origin = { lat: points_collection[i].lat, long: points_collection[i].long };
      //console.log("Origin found!");
    }
  }

  let Waypoints = {};
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
    //we will have to MANUALLY add the edges.........
  }


  //insert the x and y values into the waypoints that are relative to the STARTING ID.
  for (const element in Waypoints) {
    
  
    let res = distVincenty(origin.lat, origin.long, Waypoints[element].lat, Waypoints[element].long)
    //console.log("calculateBearing() angle: ", angle)

    let distance = res['distance'];
    let angle = res['initialBearing']
    // let p1 = [origin.lat, origin.long];
    // let p2 = [Waypoints[element].lat, Waypoints[element].long];
    // let angle2 = findAngle(p1,p2);
    // //console.log("findAngle(): ", angle2);
  
    Waypoints[element].distance = distance;
    Waypoints[element].angle = angle;
    Waypoints[element].x = distance * Math.cos(degreesToRadians(angle));
    Waypoints[element].y = distance * Math.sin(degreesToRadians(angle));
    //console.log(`title: ${Waypoints[element].title}` , `x: ${Waypoints[element].x}`, `y: ${Waypoints[element].y}`, `angle: ${angle}`)
  }
  
  //console.log(Waypoints);
  //this looks good in here, but why when I try to import it is it bad?????

generateEdges(g);

console.log(g.adjacencyList);
  export const waypoint_collection = Waypoints;

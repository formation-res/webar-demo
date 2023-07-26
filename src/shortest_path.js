import { WeightedGraph } from "./Classes/WeightedGraph.js";
import { json_str } from "./data/icon_data.js";
import { waypoints_raw } from "./data/waypoints_dump.js";
import LatLon from 'geodesy/latlon-spherical.js';

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

export function getVersion() {
  return new Promise((resolve, reject) => {
    fetch('./src/config.json')
      .then(response => response.json())
      .then(data => {
        const version = data.VERSION;
        //console.log(version);

        resolve(version);
      })
      .catch(error => {
        console.error('Error fetching or parsing config.json:', error);
        reject(error); // Reject the Promise if there's an error
      });
  });
}


//eventually want this to return only the waypoints we will visit in order based on traversal algorithm.
export function calculateWaypoints() {
  return new Promise((resolve, reject) => {
    fetch('./src/config.json')
      .then(response => response.json())
      .then(data => {
        const starting_id = data.STARTING_POI;
        const destination_id = data.DESTINATION_POI;
        console.log(`Starting id: ${starting_id}\nDestination id: ${destination_id}`);

        const hits = waypoints_raw.data.search.hits;
        var points_collection = JSON.parse(json_str);
        const g = new WeightedGraph();

        //extract origin. currently points_collections represents OUR database, which is a subset from the original excel.
        let origin = {};
        console.log(starting_id);
        for (var i = 0; i < points_collection.length; i++) {
          if (points_collection[i].id === starting_id) {
            origin = { lat: points_collection[i].lat, long: points_collection[i].long };
            console.log("Origin found!");
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
          const p2 = new LatLon(Waypoints[element].lat, Waypoints[element].long);
          const p1 = new LatLon(origin.lat, origin.long);
          let distance = p1.distanceTo(p2);
          let angle = p1.initialBearingTo(p2);

          Waypoints[element].distance = distance;
          Waypoints[element].angle = angle;
          Waypoints[element].x = distance * Math.cos(degreesToRadians(angle));
          Waypoints[element].y = distance * Math.sin(degreesToRadians(angle));
          //  console.log(`x: ${Waypoints[element].x}`, `y: ${Waypoints[element].y}`)
        }

        //console.log(Waypoints);
        //this looks good in here, but why when I try to import it is it bad?????


        resolve(Waypoints);
      })
      .catch(error => {
        console.error('Error fetching or parsing config.json:', error);
        reject(error); // Reject the Promise if there's an error
      });
  });
}

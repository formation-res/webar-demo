import { calculateBearing, haversineDistance } from "./Classes/Geo.js";
import { WeightedGraph, findAngle} from "./Classes/WeightedGraph.js";
import { json_str } from "./data/icon_data.js";
import { waypoints_raw } from "./data/waypoints_dump.js";


const hits = waypoints_raw.data.search.hits;
var points_collection = JSON.parse(json_str);
const g = new WeightedGraph();
const starting_id = "b7nHb34SwJn3S5oXkEh0vQ";
const destination_id = "UGe5iM8v-j1LDaJSuXK3Jw";

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

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
    console.log(`title: ${Waypoints[element].title}` , `x: ${Waypoints[element].x}`, `y: ${Waypoints[element].y}`, `angle: ${angle}`)
  }
  
  //onsole.log(Waypoints);
  //this looks good in here, but why when I try to import it is it bad?????


//lets test the accuracy of the distance formula. 

// Test case for Berlin to Paris
const berlinLat = 52.5200;
const berlinLong = 13.4050;
const parisLat = 48.8566;
const parisLong = 2.3522;

let angle = calculateBearing(berlinLat, berlinLong, parisLat, parisLong);
//console.log("calculateBearing() angle: ", angle); // Output: ~283.56 degrees

let p1 = [berlinLat, berlinLong];
let p2 = [parisLat, parisLong];
let angle2 = findAngle(p1, p2);
//console.log("findAngle(): ", angle2); // Output: ~283.56 degrees




/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Vincenty Inverse Solution of Geodesics on the Ellipsoid (c) Chris Veness 2002-2010             */
/*                                                                                                */
/* from: Vincenty inverse formula - T Vincenty, "Direct and Inverse Solutions of Geodesics on the */
/*       Ellipsoid with application of nested equations", Survey Review, vol XXII no 176, 1975    */
/*       http://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf                                             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/**
 * Calculates geodetic distance between two points specified by latitude/longitude using 
 * Vincenty inverse formula for ellipsoids
 *
 * @param   {Number} lat1, lon1: first point in decimal degrees
 * @param   {Number} lat2, lon2: second point in decimal degrees
 * @returns (Number} distance in metres between points
 */
function distVincenty(lat1, lon1, lat2, lon2) {
  var a = 6378137, b = 6356752.314245,  f = 1/298.257223563;  // WGS-84 ellipsoid params
  var L = degreesToRadians((lon2-lon1));
  var U1 = Math.atan((1-f) * Math.tan(  degreesToRadians(lat1) ));
  var U2 = Math.atan((1-f) * Math.tan(  degreesToRadians(lat2)));
  var sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
  var sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);
  
  var lambda = L, lambdaP, iterLimit = 100;
  do {
    var sinLambda = Math.sin(lambda), cosLambda = Math.cos(lambda);
    var sinSigma = Math.sqrt((cosU2*sinLambda) * (cosU2*sinLambda) + 
      (cosU1*sinU2-sinU1*cosU2*cosLambda) * (cosU1*sinU2-sinU1*cosU2*cosLambda));
    if (sinSigma==0) return 0;  // co-incident points
    var cosSigma = sinU1*sinU2 + cosU1*cosU2*cosLambda;
    var sigma = Math.atan2(sinSigma, cosSigma);
    var sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;
    var cosSqAlpha = 1 - sinAlpha*sinAlpha;
    var cos2SigmaM = cosSigma - 2*sinU1*sinU2/cosSqAlpha;
    if (isNaN(cos2SigmaM)) cos2SigmaM = 0;  // equatorial line: cosSqAlpha=0 (§6)
    var C = f/16*cosSqAlpha*(4+f*(4-3*cosSqAlpha));
    lambdaP = lambda;
    lambda = L + (1-C) * f * sinAlpha *
      (sigma + C*sinSigma*(cos2SigmaM+C*cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)));
  } while (Math.abs(lambda-lambdaP) > 1e-12 && --iterLimit>0);

  if (iterLimit==0) return NaN  // formula failed to converge

  var uSq = cosSqAlpha * (a*a - b*b) / (b*b);
  var A = 1 + uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
  var B = uSq/1024 * (256+uSq*(-128+uSq*(74-47*uSq)));
  var deltaSigma = B*sinSigma*(cos2SigmaM+B/4*(cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)-
    B/6*cos2SigmaM*(-3+4*sinSigma*sinSigma)*(-3+4*cos2SigmaM*cos2SigmaM)));
  var s = b*A*(sigma-deltaSigma);
  
  s = s.toFixed(3); // round to 1mm precision

  var fwdAz = Math.atan2(cosU2*sinLambda,  cosU1*sinU2-sinU1*cosU2*cosLambda);
  var revAz = Math.atan2(cosU1*sinLambda, -sinU1*cosU2+cosU1*sinU2*cosLambda);
  return { distance: s, initialBearing:  radiansToDegrees(fwdAz), finalBearing: radiansToDegrees(revAz) };
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

// let distance2 = distVincenty(berlinLat, berlinLong, parisLat, parisLong);
// console.log("vincenty: ", distance2); //878000 expected.

let distance2 = distVincenty(berlinLat, berlinLong, parisLat, parisLong);
console.log("vincenty: ", distance2);

  export const waypoint_collection = Waypoints;

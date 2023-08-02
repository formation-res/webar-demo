import * as turf from '@turf/turf';
import {json_str} from '../data/corners.js';
import { waypoint_collection } from '../shortest_path.js';

const corners_initial = JSON.parse(json_str);
const corners = {};
var Rooms = []; //array of geojson objects, which are just JSON objects really. 


//going to make it a key:value relationship so it is easier to access points we want. index by TITLE, since we named it smartly.
function fillCorners() {
    for (var i = 0; i < corners_initial.length; i++) {
      corners[corners_initial[i].hit.title] = {
        id: corners_initial[i].hit.id,
        lat: corners_initial[i].hit.latLon.lat,
        long: corners_initial[i].hit.latLon.lon,
        color: corners_initial[i].hit.color,
      };
    }
}

function testPolygons(){
    
    const wp_middle = [ waypoint_collection["8M-V4tmK7B0ycDADY2QhaA"].lat, waypoint_collection["8M-V4tmK7B0ycDADY2QhaA"].long ];
    const waypoint4 = [ waypoint_collection["Prle_dqgn0nZFRvHMkhReA"].lat, waypoint_collection["Prle_dqgn0nZFRvHMkhReA"].long ];
    const waypoint3 = [ waypoint_collection["Jf4oujbxDxty4o9rTdLWkA"].lat, waypoint_collection["Jf4oujbxDxty4o9rTdLWkA"].long ];
    const waypoint2 = [ waypoint_collection["sK_AvPfFzIlFm5yrdP_mBQ"].lat, waypoint_collection["sK_AvPfFzIlFm5yrdP_mBQ"].long ];
    const waypoint_demo6 = [ waypoint_collection["pp93HatKOfganUXN32jLXA"].lat, waypoint_collection["pp93HatKOfganUXN32jLXA"].long ];
    const room5_wp = [ waypoint_collection["y8GXdICp6MHQfzBUWx-1Ag"].lat, waypoint_collection["y8GXdICp6MHQfzBUWx-1Ag"].long ];
    

if ((turf.booleanPointInPolygon(wp_middle, main_room) == false) ||
    (turf.booleanPointInPolygon(waypoint4, main_room) == true)  ||
    (turf.booleanPointInPolygon(waypoint3, main_room) == false) )
    {
        console.log("main_room test falied!");
    }

if ((turf.booleanPointInPolygon(wp_middle, room_1) == true)  ||
    (turf.booleanPointInPolygon(waypoint4, room_1) == true)  ||
    (turf.booleanPointInPolygon(waypoint3, room_1) == true) || 
    (turf.booleanPointInPolygon(waypoint2, room_1) == false)  )
    {
        console.log("room_1 test FAILED!");
    }

if ((turf.booleanPointInPolygon(wp_middle, room_2) == true)  ||
    (turf.booleanPointInPolygon(waypoint4, room_2) == false) ||
    (turf.booleanPointInPolygon(waypoint3, room_2) == true)  )
    {
        console.log("room_2 test FAILED!");
    }

if ((turf.booleanPointInPolygon(wp_middle, room_3) == true)  ||
    (turf.booleanPointInPolygon(waypoint4, room_3) == true) ||
    (turf.booleanPointInPolygon(waypoint3, room_3) == true) ||
    (turf.booleanPointInPolygon(waypoint_demo6, room_3) == false) )
    {
        console.log("room_3 test FAILED!");
    }

if ((turf.booleanPointInPolygon(wp_middle, room_4) == true)  ||
    (turf.booleanPointInPolygon(waypoint4, room_4) == true) ||
    (turf.booleanPointInPolygon(waypoint3, room_4) == true) ||
    (turf.booleanPointInPolygon(waypoint_demo6, room_4) == true) )
    {
        console.log("room_4 test FAILED!");
    }

if ((turf.booleanPointInPolygon(wp_middle, room_5) == true)  ||
    (turf.booleanPointInPolygon(waypoint4, room_5) == true) ||
    (turf.booleanPointInPolygon(waypoint3, room_5) == true) ||
    (turf.booleanPointInPolygon(room5_wp, room_5) == false) ||
    (turf.booleanPointInPolygon(waypoint_demo6, room_5) == true) )
    {
        console.log("room_5 test FAILED!");
    }
}

// ------------------------------------------------------------ Creating Rooms ------------------------------------------------------------
fillCorners()   //create the list.

// 1d 23 2f 8 1a 1c 1d    =   corners connected 
var main_room = turf.polygon([[
    [corners["corner1d"].lat, corners["corner1d"].long],
    [corners["corner23"].lat, corners["corner23"].long],
    [corners["corner2f"].lat, corners["corner2f"].long],
    [corners["corner8"].lat, corners["corner8"].long],
    [corners["corner1a"].lat, corners["corner1a"].long],
    [corners["corner1c"].lat, corners["corner1a"].long],
    [corners["corner1d"].lat, corners["corner1d"].long]
]])
Rooms.push(main_room);

// 1 2 1c 1f 1d 1
var room_1 = turf.polygon([[
    [corners["corner1"].lat, corners["corner1"].long],
    [corners["corner2"].lat, corners["corner2"].long],
    [corners["corner1c"].lat, corners["corner1c"].long],
    [corners["corner1f"].lat, corners["corner1f"].long],
    [corners["corner1d"].lat, corners["corner1d"].long],
    [corners["corner1"].lat, corners["corner1"].long]
]])
Rooms.push(room_1);

// 2 3 1b 1c 2
var room_2 = turf.polygon([[
    [corners["corner2"].lat, corners["corner2"].long],
    [corners["corner3"].lat, corners["corner3"].long],
    [corners["corner1b"].lat, corners["corner1b"].long],
    [corners["corner1c"].lat, corners["corner1c"].long],
    [corners["corner2"].lat, corners["corner2"].long],
]])
Rooms.push(room_2);

// 3 4 5 1b 3
var room_3 = turf.polygon([[
    [corners["corner3"].lat, corners["corner3"].long],
    [corners["corner4"].lat, corners["corner4"].long],
    [corners["corner5"].lat, corners["corner5"].long],
    [corners["corner1b"].lat, corners["corner1b"].long],
    [corners["corner3"].lat, corners["corner3"].long],
]])
Rooms.push(room_3);

// 5 6 9 1a 5
var room_4 = turf.polygon([[
    [corners["corner5"].lat, corners["corner5"].long],
    [corners["corner6"].lat, corners["corner6"].long],
    [corners["corner9"].lat, corners["corner9"].long],
    [corners["corner1a"].lat, corners["corner1a"].long],
    [corners["corner5"].lat, corners["corner5"].long]
]])
Rooms.push(room_4);

// 6 7 8 9 6
var room_5 = turf.polygon([[
    [corners["corner6"].lat, corners["corner6"].long],
    [corners["corner7"].lat, corners["corner7"].long],
    [corners["corner8"].lat, corners["corner8"].long],
    [corners["corner9"].lat, corners["corner9"].long],
    [corners["corner6"].lat, corners["corner6"].long]
]])
Rooms.push(room_5);

// ------------------------------------------------------------ Main ------------------------------------------------------------


testPolygons();



// SAMPLE USAGE //
var pt = turf.point([-77, 44]);
var poly = turf.polygon([[
  [-81, 41],
  [-81, 47],
  [-72, 47],
  [-72, 41],
  [-81, 41]
]]);

turf.booleanPointInPolygon(pt, poly);
//= true



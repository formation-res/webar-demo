import * as turf from "@turf/turf"
import {json_str} from '../data/corners.js';
import { json_str_wp } from "../data/waypoints_dump.js";

const corners_initial = JSON.parse(json_str);
const corners = {};

export var Rooms = []; //array of geojson objects, which are just JSON objects really. 
//  Rooms[0].properties.title        = name
//  Rooms[0].geometry.coordinates    = array values
//  Room[0]                          = the polygon we compare with


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
    //set up test_waypoint_collection:
    const hits = JSON.parse(json_str_wp);
    var test_waypoint_collection = {};
    for (var i = 0; i < hits.length; i++) {
        test_waypoint_collection[hits[i].hit.id] = {
          title: hits[i].hit.title,
          color: hits[i].hit.color,
          lat: hits[i].hit.latLon.lat,
          long: hits[i].hit.latLon.lon,
          description: hits[i].hit.description,
        };
      }


    //points to test geojson polygons
    const wp_middle = [ test_waypoint_collection["8M-V4tmK7B0ycDADY2QhaA"].lat, test_waypoint_collection["8M-V4tmK7B0ycDADY2QhaA"].long ];
    const waypoint4 = [ test_waypoint_collection["Prle_dqgn0nZFRvHMkhReA"].lat, test_waypoint_collection["Prle_dqgn0nZFRvHMkhReA"].long ];
    const waypoint3 = [ test_waypoint_collection["Jf4oujbxDxty4o9rTdLWkA"].lat, test_waypoint_collection["Jf4oujbxDxty4o9rTdLWkA"].long ];
    const waypoint2 = [ test_waypoint_collection["sK_AvPfFzIlFm5yrdP_mBQ"].lat, test_waypoint_collection["sK_AvPfFzIlFm5yrdP_mBQ"].long ];
    const waypoint_demo6 = [ test_waypoint_collection["pp93HatKOfganUXN32jLXA"].lat, test_waypoint_collection["pp93HatKOfganUXN32jLXA"].long ];
    const room5_wp = [ test_waypoint_collection["y8GXdICp6MHQfzBUWx-1Ag"].lat, test_waypoint_collection["y8GXdICp6MHQfzBUWx-1Ag"].long ];
    const wp_men = [ test_waypoint_collection["nuItd28dpxpJfZKep_Wx0Q"].lat, test_waypoint_collection["nuItd28dpxpJfZKep_Wx0Q"].long ];
    const wp_female = [ test_waypoint_collection["7UWclg7NYhPtbPvzgfiPtg"].lat, test_waypoint_collection["7UWclg7NYhPtbPvzgfiPtg"].long ];

    //test cases foe every room. 
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

    if ((turf.booleanPointInPolygon(wp_middle, room_6) == true)  ||
    (turf.booleanPointInPolygon(waypoint4, room_6) == true) ||
    (turf.booleanPointInPolygon(waypoint3, room_6) == true) ||
    (turf.booleanPointInPolygon(room5_wp, room_6) == true) ||
    (turf.booleanPointInPolygon(wp_men, room_6) == false) ||
    (turf.booleanPointInPolygon(waypoint_demo6, room_6) == true) )
    {
        console.log("room_6 test FAILED!");
    }

    if ((turf.booleanPointInPolygon(wp_middle, room_7) == true)  ||
    (turf.booleanPointInPolygon(waypoint4, room_7) == true) ||
    (turf.booleanPointInPolygon(waypoint3, room_7) == true) ||
    (turf.booleanPointInPolygon(room5_wp, room_7) == true) ||
    (turf.booleanPointInPolygon(wp_men, room_7) == true) ||
    (turf.booleanPointInPolygon(waypoint_demo6, room_7) == true) )
    {
        console.log("room_7 test FAILED!");
    }

    if ((turf.booleanPointInPolygon(wp_middle, kitchen) == true)  ||
    (turf.booleanPointInPolygon(waypoint4, kitchen) == true) ||
    (turf.booleanPointInPolygon(waypoint3, kitchen) == true) ||
    (turf.booleanPointInPolygon(room5_wp, kitchen) == true) ||
    (turf.booleanPointInPolygon(wp_men, kitchen) == true) ||
    (turf.booleanPointInPolygon(wp_female, kitchen) == false) ||
    (turf.booleanPointInPolygon(waypoint_demo6, kitchen) == true) )
    {
        console.log("kitchen test FAILED!");
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
main_room.properties.title = "main_room";
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
room_1.properties.title = "room_1";
Rooms.push(room_1);

// 2 3 1b 1c 2
var room_2 = turf.polygon([[
    [corners["corner2"].lat, corners["corner2"].long],
    [corners["corner3"].lat, corners["corner3"].long],
    [corners["corner1b"].lat, corners["corner1b"].long],
    [corners["corner1c"].lat, corners["corner1c"].long],
    [corners["corner2"].lat, corners["corner2"].long],
]])
room_2.properties.title = "room_2";
Rooms.push(room_2);

// 3 4 5 1b 3
var room_3 = turf.polygon([[
    [corners["corner3"].lat, corners["corner3"].long],
    [corners["corner4"].lat, corners["corner4"].long],
    [corners["corner5"].lat, corners["corner5"].long],
    [corners["corner1b"].lat, corners["corner1b"].long],
    [corners["corner3"].lat, corners["corner3"].long],
]])
room_3.properties.title = "room_3";
Rooms.push(room_3);

// 5 6 9 1a 5
var room_4 = turf.polygon([[
    [corners["corner5"].lat, corners["corner5"].long],
    [corners["corner6"].lat, corners["corner6"].long],
    [corners["corner9"].lat, corners["corner9"].long],
    [corners["corner1a"].lat, corners["corner1a"].long],
    [corners["corner5"].lat, corners["corner5"].long]
]])
room_4.properties.title = "room_4";
Rooms.push(room_4);

// 6 7 8 9 6
var room_5 = turf.polygon([[
    [corners["corner6"].lat, corners["corner6"].long],
    [corners["corner7"].lat, corners["corner7"].long],
    [corners["corner8"].lat, corners["corner8"].long],
    [corners["corner9"].lat, corners["corner9"].long],
    [corners["corner6"].lat, corners["corner6"].long]
]])
room_5.properties.title = "room_5";
Rooms.push(room_5);

// 7 8 2d 2b 7
var room_6 = turf.polygon([[
    [corners["corner7"].lat, corners["corner7"].long],
    [corners["corner8"].lat, corners["corner8"].long],
    [corners["corner2d"].lat, corners["corner2d"].long],
    [corners["corner2b"].lat, corners["corner2b"].long],
    [corners["corner7"].lat, corners["corner7"].long]
]])
room_6.properties.title = "room_6";
Rooms.push(room_6);

// 29 2a 2b 2d 29
var room_7 = turf.polygon([[
    [corners["corner29"].lat, corners["corner29"].long],
    [corners["corner2a"].lat, corners["corner2a"].long],
    [corners["corner2b"].lat, corners["corner2b"].long],
    [corners["corner2d"].lat, corners["corner2d"].long],
    [corners["corner29"].lat, corners["corner29"].long]
]])
room_7.properties.title = "room_7";
Rooms.push(room_7);

// 25 26 27 28 29 8 25
var kitchen = turf.polygon([[
    [corners["corner25"].lat, corners["corner25"].long],
    [corners["corner26"].lat, corners["corner26"].long],
    [corners["corner27"].lat, corners["corner27"].long],
    [corners["corner28"].lat, corners["corner28"].long],
    [corners["corner29"].lat, corners["corner29"].long],
    [corners["corner8"].lat, corners["corner8"].long],
    [corners["corner25"].lat, corners["corner25"].long]
]])
kitchen.properties.title = "kitchen";
Rooms.push(kitchen);

// ------------------------------------------------------------ Main ------------------------------------------------------------


testPolygons();
// console.log(Rooms[0].geometry.coordinates);
// console.log(Rooms);
// console.log(main_room);



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



import geogeometry
# parses the data in the spreadsheet.
# yields the filtered corrdinates that meet the criteria, and stores them into a list.

import sys, json
import numpy as np
from vincenty import vincenty


def find_angle(p1, p2):
        """
        Find the angle between two points.
        """
        distance_x = p2[0] - p1[0]
        distance_y = p2[1] - p1[1]

        angle_radians = np.arctan2(distance_y, distance_x)
        angle_degrees = np.degrees(angle_radians)
        fixed_angle_degrees = (angle_degrees + 360) % 360
        return fixed_angle_degrees

 
def create_point_collection_in_json(geo_obj, points_collection):
    point_collection_in_json = []
    for row in points_collection:
        # starting id:
        origin_long = float(geo_obj.starting_id_info[3])
        origin_lat = float(geo_obj.starting_id_info[2])
        p1 = (origin_lat, origin_long)

        # current id
        current_long = float(row[3])
        current_lat = float(row[2])
        p2 = (current_lat, current_long)

        # calculate the distance between two points:
        distance = vincenty(p1, p2)*1000

        # calculate the angle between two points:
        angle = find_angle(p1, p2)
        x = distance*np.cos(angle)
        y= distance*np.sin(angle)

        # append each point to the list:
        point_collection_in_json.append({'id': row[0], 'title': row[1], 'long': row[2], 'lat': row[3], 'color': row[4], 'category': row[5], 'shape': row[6], 'distance': distance, 'angle': angle, 'x': x, 'y': y})

    return point_collection_in_json
    #print(f'distance between the first two points: {vincenty(p1, p2)*1000} meters.')
    #print(f'angle between the first two points: {find_angle(p1, p2)} degrees.')
    # [{'id': 'dhfeht', 'color': 'hiii'}, {'id': 'dhfeht', 'color': 'hiii'}]


def execute():
    # starting point is an id. in this case, it will be the reception desk...
    starting_id = '3m5thyVvZnMKukIqIrhYHQ'
    filter_criteria = 'Toilet'

    # generate a list of points we want to display with web ar:
    geo_obj = geogeometry.GeoGeometry(starting_id, filter_criteria)
    csv_line_generator_filtered = geo_obj.parse_coordinates()
    points_collection = [i for i in csv_line_generator_filtered]

    # create a list of dictionaries for web ar points:
    point_collection_in_json = create_point_collection_in_json(geo_obj, points_collection)
    return point_collection_in_json


if __name__ == "__main__":
    point_collection_in_json = execute()

    # -------------------------------- Export to JSON -------------------------------- 

    #file exporting to, w needed for WRITE
    sys.stdout = open('icon_data.js', 'w')

    #where points_collection is the dictionary
    json_obj = json.dumps(point_collection_in_json)

    #this is printed in icon_data.js --- it will overwrite every time. 
    print("var json_str = '{}' ".format(json_obj) )
    '''
    we want to run this EVERY time the user changes what they are searching for.
    '''

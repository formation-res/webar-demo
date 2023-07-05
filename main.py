# parses the data in the spreadsheet.
# yields the filtered corrdinates that meet the criteria, and stores them into a list.

import csv
import numpy as np
from vincenty import vincenty


def filter(title, current_title: str):
    """
    Decide if the row being examined meets the criteria.
    If the row meets the criteria (the filter), then True will be returned and the row will be stored in points_collection.
    """
    if title is None:
        return True
    else:
        if title == current_title:
            return True
        else:
            return False


def parse_coordinates(title=None):
    """
    A generator function to parse through each line of the csv file (the google spreadsheet with point/object information).
    The (id, title, long, lat, color, category, shape) is yielded for each row that meets the filter criteria.
    """
    with open('points.csv', 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            if filter(title, row[5]):
                x = row[7]
                first = x.find('[')
                second = x.find(']')

                draft = x[first+1:second]
                new = draft.split('_COMMA_')
                long = new[0]
                lat = new[-1]

                yield (row[0], row[5], long, lat, row[10], row[17], row[25])


# generate a list of points we want to display with web ar:
csv_line_generator_filtered = parse_coordinates('Toilet')
points_collection = [i for i in csv_line_generator_filtered]
# for i in points_collection:
#      print(i)
#      print()


# find the distance between two points:
lat1 = float(points_collection[1][2])
long1 = float(points_collection[1][3])
p1 = (lat1, long1)

lat2 = float(points_collection[0][2])
long2 = float(points_collection[0][3])
p2 = (lat2, long2)

print("distance between the first two points:", vincenty(p1,p2)*1000, " meters.")


# find the angle between two points:
def find_angle(p1, p2):
    distance_x = p2[0] - p1[0]
    distance_y = p2[1] - p1[1]

    angle_radians = np.arctan2(distance_y, distance_x)
    angle_degrees = np.degrees(angle_radians)
    fixed_angle_degrees = (angle_degrees + 360) % 360
    return fixed_angle_degrees

print(f'angle between the first two points: {find_angle(p1, p2)} degrees.')

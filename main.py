# how to parse the data in the spreadsheet.
# yields the filtered corrdinates that meet the criteria, and stores them into a list.

import csv


def filter():
    return True


def parse_coordinates():
    with open('points.csv', 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            if filter():
                

                yield (row[0], row[5], x, y, row[10], row[17], row[25])
                # id, title, x, y, color, category, shape


csv_line_generator_filtered = parse_coordinates()
points_collection = [i for i in csv_line_generator_filtered]
for i in points_collection:
    print(i)
    print()

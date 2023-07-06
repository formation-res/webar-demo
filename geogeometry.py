# parses the data in the spreadsheet.
# yields the filtered corrdinates that meet the criteria, and stores them into a list.

import csv


class GeoGeometry:
    def __init__(self, starting_id: str, filter_criteria=None):
        self.starting_id = starting_id  # origin
        self.filter_criteria = filter_criteria  # the 'title' we are filtering by
        self.starting_id_info = None  # to be defined in the parse_coordinates() method (self.search_id's attributes)


    def filter(self, current_title: str):
        """
        Decide if the row being examined meets the criteria.
        If the row meets the criteria (the filter), then True will be returned and the row will be stored in points_collection.
        """
        if self.filter_criteria is None:
            return True
        else:
            if self.filter_criteria == current_title:
                return True
            else:
                return False


    def parse_coordinates(self):
        """
        A generator function to parse through each line of the csv file (the google spreadsheet with point/object information).
        The (id, title, long, lat, color, category, shape) is yielded for each row that meets the filter criteria.
        """
        with open('points.csv', 'r') as file:
            reader = csv.reader(file)
            for row in reader:
                if self.filter(row[5]) or row[0] == self.starting_id:
                    x = row[7]
                    first = x.find('[')
                    second = x.find(']')

                    draft = x[first+1:second]
                    new = draft.split('_COMMA_')
                    long = new[0]
                    lat = new[-1]

                    if row[0] == self.starting_id:
                        self.starting_id_info = (row[0], row[5], long, lat, row[10], row[17], row[24])
                    else:
                        yield (row[0], row[5], long, lat, row[10], row[17], row[24])

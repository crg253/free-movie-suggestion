import csv
from ../app import db
from ../app.models import Movie
import json

def csvLoader(file):

    with open(file) as openedFile:
        csvReaderObject = csv.reader(openedFile)
        cro = csvReaderObject
        for row in cro:
            uniquename = (row[0].lower() +row[1]).replace(' ', '')
            if Movie.query.filter_by(uniquename=uniquename).first()  == None:
                uniquename = Movie(uniquename=uniquename,
                                    name=row[0],
                                    year=row[1],
                                    video_link=row[2],
                db.session.add(uniquename)
                db.session.commit()

    for movie in Movie.query.all():
        print(str(movie.movie_id) + ' ' + movie.uniquename + ' ' + movie.name + ' ' + str(movie.year) + ' ' + movie.video_link)
        print(json.dumps({'uniquename': movie.uniquename}))

import csv
from flask_app import Movie, db
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
                                    genre=row[3])
                db.session.add(uniquename)
                db.session.commit()

    for movie in Movie.query.all():
        print(str(movie.id) + ' ' + movie.uniquename + ' ' + movie.name + ' ' + str(movie.year) + ' ' + movie.video_link + ' ' + movie.genre )
        print(json.dumps({'uniquename': movie.uniquename}))

import csv
from app import db
from app.models import Movie, Tag
import json


def CSVLoader(file):

    with open(file) as openedFile:
        csvReaderObject = csv.reader(openedFile)
        cro = csvReaderObject
        for row in cro:

            #refine this
            uniquename = (row[0].lower() +row[1]).replace(' ', '')
            uniquename = uniquename.replace("'", '')
            uniquename = uniquename.replace(',', '')
            uniquename = uniquename.replace('!', '')
            uniquename = uniquename.replace('.', '')
            uniquename = uniquename.replace(':', '')
            uniquename = uniquename.replace('&', '')


            if Movie.query.filter_by(uniquename=uniquename).first()  == None:
                uniquename = Movie(uniquename=uniquename,
                                    name=row[0],
                                    year=row[1],
                                    video_link=row[2])
                db.session.add(uniquename)


                for t in range(3, len(row)):
                    tagname = row[t]
                    if Tag.query.filter_by(name=tagname).first()  == None:
                        tagname = Tag(name=tagname)
                        db.session.add(tagname)
                    else:
                        tagname = Tag.query.filter_by(name=tagname).first()

                    uniquename.tags.append(tagname)


                db.session.commit()

    # Check Results
    #
    # for movie in Movie.query.all():
    #     print(str(movie.movie_id) + ' ' + movie.uniquename + ' ' + movie.name + ' ' + str(movie.year) + ' ' + movie.video_link)
    #     for t in movie.tags:
    #         print(t.name)
    # for tag in Tag.query.all():
    #     print(tag.name)
    #     for m in tag.movies:
    #         print(m.name)

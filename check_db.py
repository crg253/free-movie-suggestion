from app import db
from app.models import Movie, Tag


def check_db():

    for movie in Movie.query.all():
        print(str(movie.movie_id)+ '/')
        print(movie.uniquename + '/')
        print(movie.name + '/')
        print(str(movie.year) + '/')
        print(movie.video_link + '/')
        for t in movie.tags:
            print(t.name + '/')

    for tag in Tag.query.all():
        print(tag.name + '/')
        for m in tag.movies:
            print(m.name + '/')

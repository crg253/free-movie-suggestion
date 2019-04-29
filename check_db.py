from app import db
from app.models import Movie, Tag, User


def check_db():

    # for movie in Movie.query.all():
    #     print(str(movie.movie_id)+ '/')
    #     print(movie.uniquename + '/')
    #     print(movie.name + '/')
    #     print(str(movie.year) + '/')
    #     print(movie.video_link + '/')
    #     for t in movie.tags:
    #         print(t.name + '/')
    #
    # for tag in Tag.query.all():
    #     print(tag.name + '/')
    #     for m in tag.movies:
    #         print(m.name + '/')

    for user in User.query.all():
        print('USER')
        print(user.username + '/' )
        for m in user.user_movies:
            print(str(m.movie_id) + '/')
            print(m.name + '/')
            print(m.uniquename + '/')
            print(str(m.year) + '/')
            print(m.video_link + '/')
            for t in m.tags:
                print(t.name + '/')

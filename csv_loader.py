import csv
from app import db
from app.models import Movie, Tag
import re

'''
Add approved movies for user_id = 1
'''

def slugify(slug):
    to_remove = [' ', "'", ',', '!', '.', ':', '&', '-' ]
    for item in to_remove:
        slug = slug.replace(item, '')
    return slug

def tag_exists(name):
    return Tag.query.filter_by(name=name).first() is not None


def add_tags(movie, tag_names):
    for name in tag_names:
        if tag_exists(name):
            tag = Tag.query.filter_by(name=name).first()
        else:
            tag = Tag(name=name)
            db.session.add(tag)
        movie.tags.append(tag)


def load_movie(row):
    slug = slugify(row[0].lower() +row[1])
    movie = Movie(user_id=1, status="approved", uniquename=slug, name=row[0], year=row[1], video_link=row[2])
    db.session.add(movie)
    add_tags(movie, row[3:])


def load_movies(file):
    '''
    Opens a csv movie list.
    Adds each movie, and its tags to db.
    '''
    with open(file) as movies:
        for movie in csv.reader(movies):
            load_movie(movie)
            db.session.commit()

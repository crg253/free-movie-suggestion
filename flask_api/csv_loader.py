import csv
from app import db
from app.models import Movie, Tag


def slugify(slug):
    to_remove = [' ', "'", ',', '!', '.', ':', '&', '-' ]
    for item in to_remove:
        slug = slug.replace(item, '')
    return slug


def tag_exists(name):
    return Tag.query.filter_by(name= name).first() != None


def add_tags(movieSlug,row):
    for t in range(3, len(row)):
        tagSlug = slugify(row[t])
        if tag_exists(row[t]):
            tagSlug = Tag.query.filter_by(name= row[t]).first()
        else:
            tagSlug = Tag(name=row[t])
            db.session.add(tagSlug)
        movieSlug.tags.append(tagSlug)


def load_movie(row):
    movieSlug =slugify(row[0].lower() +row[1])
    movieSlug = Movie(uniquename=movieSlug,name=row[0],year=row[1],video_link=row[2])
    db.session.add(movieSlug)
    add_tags(movieSlug, row)


def load_movies(file):
    with open(file) as movies:
        for movie in csv.reader(movies):
            load_movie(movie)
            db.session.commit()

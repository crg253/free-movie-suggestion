from flask import jsonify
from app import app
from app.models import Movie, Tag
from flask_cors import cross_origin

@app.route('/')
@app.route('/index')
def index():
    return "Hello, World!"

@app.route('/movies')
@cross_origin()
def movies():
    movies = []
    for movie in Movie.query.all():
        movies.append({"id":movie.movie_id,
                        "name":movie.name,
                        "slug":movie.uniquename,
                        "tags":[x.name for x in movie.tags],
                        "video":movie.video_link,
                        "year":movie.year})
    return jsonify(movies)

@app.route('/genres')
@cross_origin()
def genres():
    genres = []
    for genre in Tag.query.all():
        genres.append(genre.name)
    return jsonify(genres)

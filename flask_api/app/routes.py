from flask import jsonify
from app import app
from app.models import Movie, Tag

@app.route('/')
@app.route('/index')
def index():
    return "Hello, World!"

@app.route('/movies')
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

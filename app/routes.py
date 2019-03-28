from flask import jsonify, render_template
from app import app
from app.models import Movie, Tag
from flask_cors import cross_origin

@app.route('/')
@app.route('/index')
def index():
    return ('Change to render_template index')

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

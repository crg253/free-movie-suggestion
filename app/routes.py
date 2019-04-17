from flask import jsonify, render_template
from app import app
from app.models import Movie, Tag, User
from flask_cors import cross_origin

@app.route('/api/adduser', methods=['POST'])
@cross_origin()
def add_user():
    #user = User(username=username)
    #db.session.add(user)
    #db.session.commit()


@app.route('/api/allusers', methods=['GET'])
@cross_origin()
def all_users():
    all_users = []
    for u in User.query.all():
        all_users.append({'username':u.username})
    return jsonify(all_users)

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

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return ('Change to render_template index')

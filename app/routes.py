from flask import jsonify, render_template, request
from app import app, db
from app.models import Movie, Tag, User

@app.route('/api/adduser', methods=['POST'])
def add_user():
    data=request.get_json(silent=True) or {}
    newUser = User(username=data.get('userName'))
    db.session.add(newUser)
    db.session.commit()
    return jsonify(newUser)


@app.route('/api/allusers', methods=['GET'])
def all_users():
    all_users = []
    for u in User.query.all():
        all_users.append({'username':u.username})
    return jsonify(all_users)

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

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return ('Change to render_template index')

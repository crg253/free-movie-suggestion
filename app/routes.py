from flask import jsonify, render_template, request, g
from app import app, db
from app.models import Movie, Tag, User
from app.auth import basic_auth, token_auth


@app.route('/api/user', methods=['GET'])
@token_auth.login_required
def user():
    return jsonify({'user':g.current_user.username}), 200


@app.route('/api/adduser', methods=['POST'])
def add_user():
    data=request.get_json(silent=True) or {}
    newUser = User(username=data.get('userName'))
    newUser.set_password(data.get('password'))
    db.session.add(newUser)
    db.session.commit()
    return jsonify('Test Response'),201

@app.route('/api/signin', methods=['GET','POST'])
@basic_auth.login_required
def sign_in():
    token = g.current_user.get_token()
    db.session.commit()
    return jsonify({'token':token})

@app.route('/api/movies')
def movies():
    movies = []
    for movie in Movie.query.filter_by(status='approved'):
        movies.append({"id":movie.movie_id,
                        "name":movie.name,
                        "slug":movie.uniquename,
                        "tags":[x.name for x in movie.tags],
                        "video":movie.video_link,
                        "year":movie.year,
                        'user':User.query.filter_by(user_id=movie.user_id).first().username})
    return jsonify(movies)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return ('Change to render_template index')

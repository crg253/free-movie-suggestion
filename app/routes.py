from flask import jsonify, render_template, request, g
from app import app, db
from app.models import Movie, Tag, User
from app.auth import basic_auth


@app.route('/api/adduser', methods=['POST'])
def add_user():
    data=request.get_json(silent=True) or {}
    print(data)
    newUser = User(username=data.get('userName'))
    newUser.set_password(data.get('password'))
    db.session.add(newUser)
    db.session.commit()
    return jsonify('Test Response'),201


@app.route('/api/user', methods=['GET'])
@basic_auth.login_required
def user():
    return jsonify(g.current_user.username)

@app.route('/movies')
def movies():
    #print("/movies api call")
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

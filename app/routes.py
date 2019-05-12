from flask import jsonify, render_template, request, g
from app import app, db
from app.models import Movie, Tag, User
from app.auth import basic_auth, token_auth

def slugify(slug):
    to_remove = [' ', "'", ',', '!', '.', ':', '&', '-' ]
    for item in to_remove:
        slug = slug.replace(item, '')
    return slug



'''
Need to split this into two functions? getsavedmovies getsuggested movies
'''
# @app.route('/api/usermovies', methods=['GET'])
# @token_auth.login_required
# def user_movies():
#     user_movies = []
#     for movie in g.current_user.user_movies:
#         user_movies.append({"name":movie.name,"year":movie.year})
#     return jsonify({'movies':user_movies, 'user':g.current_user.username}), 201

@app.route('/api/savemovie', methods=['POST'])
@token_auth.login_required
def savemovie():
    data=request.get_json(silent=True) or {}
    movie_to_save = Movie.query.filter_by(uniquename=data.get('slug')).first()
    g.current_user.saves.append(movie_to_save)
    db.session.commit()
    return '', 200
    pass

@app.route('/api/suggestmovie', methods=['POST'])
@token_auth.login_required
def user():
    data=request.get_json(silent=True) or {}
    uniquename = slugify(data.get('title')).lower() +  data.get('year')
    title = data.get('title')
    year = data.get('year')
    user = User.query.filter_by(username=g.current_user.username).first()
    movie = Movie(uniquename=uniquename,name=title, year=year, user_id=user.user_id, status="pending")
    db.session.add(movie)
    db.session.commit()
    return '', 200

@app.route('/api/revoketoken', methods=['DELETE'])
@token_auth.login_required
def revoke_token():
    g.current_user.revoke_token()
    db.session.commit()
    return '', 204

@app.route('/api/checktoken', methods=['GET'])
@token_auth.login_required
def checktoken():
    return '', 200

@app.route('/api/signin', methods=['POST'])
@basic_auth.login_required
def sign_in():
    token = g.current_user.get_token()
    db.session.commit()
    return jsonify({'token':token}), 200

@app.route('/api/adduser', methods=['POST'])
def add_user():
    data=request.get_json(silent=True) or {}
    newUser = User(username=data.get('userName'))
    newUser.set_password(data.get('password'))
    db.session.add(newUser)
    db.session.commit()
    return jsonify({'comment':"It worked!"}),201

@app.route('/api/movies')
def movies():
    movies = []
    for movie in Movie.query.all():
        movies.append({"id":movie.movie_id,
                        "name":movie.name,
                        "slug":movie.uniquename,
                        "tags":[x.name for x in movie.tags],
                        "video":movie.video_link,
                        "status":movie.status,
                        "year":movie.year,
                        'user':User.query.filter_by(user_id=movie.user_id).first().username})
    return jsonify(movies)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return ('Change to render_template index')

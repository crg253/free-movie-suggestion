from flask import jsonify, render_template, request, g
from app import app, db
from app.models import Movie, Tag, User
from app.auth import basic_auth, token_auth

def slugify(slug):
    to_remove = [' ', "'", ',', '!', '.', ':', '&', '-' ]
    for item in to_remove:
        slug = slug.replace(item, '')
    return slug

def getusermovies():
    movies = []
    for movie in Movie.query.all():
        movies.append({"id":movie.movie_id,
                        "slug":movie.uniquename,
                        "name":movie.name,
                        "year":movie.year,
                        "video":movie.video_link,
                        "tags":[x.name for x in movie.tags],
                        "status":movie.status,
                        'username':movie.username,
                        'saved':True if g.current_user in movie.savers else False })
    return(movies)

def getnonusermovies():
    movies = []
    for movie in Movie.query.all():
        movies.append({"id":movie.movie_id,
                        "slug":movie.uniquename,
                        "name":movie.name,
                        "year":movie.year,
                        "video":movie.video_link,
                        "tags":[x.name for x in movie.tags],
                        "status":movie.status,
                        'username':movie.username,
                        'saved':False})
    return(movies)

#def removesuggestion

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
    return jsonify({'movies':getusermovies(), 'user':g.current_user.username}), 200

@app.route('/api/adduser', methods=['POST'])
def add_user():
    data=request.get_json(silent=True) or {}
    newUser = User(username=data.get('userName'))
    newUser.set_password(data.get('password'))
    db.session.add(newUser)
    db.session.commit()
    return '',201








@app.route('/api/unsavemovie', methods=['POST'])
@token_auth.login_required
def unsavemovie():
    data=request.get_json(silent=True) or {}
    print(data.get('slug'))
    movie_to_unsave = Movie.query.filter_by(uniquename=data.get('slug')).first()
    g.current_user.saves.remove(movie_to_unsave)
    db.session.commit()
    return jsonify({'movies':getusermovies(), 'user':g.current_user.username}), 200

@app.route('/api/savemovie', methods=['POST'])
@token_auth.login_required
def savemovie():
    data=request.get_json(silent=True) or {}
    movie_to_save = Movie.query.filter_by(uniquename=data.get('slug')).first()
    g.current_user.saves.append(movie_to_save)
    db.session.commit()
    return jsonify({'movies':getusermovies(), 'user':g.current_user.username}), 200

@app.route('/api/revoketoken', methods=['POST'])
@token_auth.login_required
def revoke_token():
    g.current_user.revoke_token()
    db.session.commit()
    return jsonify({'movies':getnonusermovies(), 'user':''}), 200

@app.route('/api/checktoken', methods=['POST'])
@token_auth.login_required
def checktoken():
    return jsonify({'user':g.current_user.username, 'movies':getusermovies()}), 200

@app.route('/api/signin', methods=['POST'])
@basic_auth.login_required
def sign_in():
    token = g.current_user.get_token()
    db.session.commit()
    return jsonify({'user':g.current_user.username,'token':token, 'movies':getusermovies()}), 200

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return ('Change to render_template index')

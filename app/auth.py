from flask import g, request, jsonify
from app.models import User
from app import app, db, basic_auth, token_auth
from app.models import Movie, Tag, User

def get_non_usermovies():
    non_usermovies = []
    for movie in Movie.query.all():
        non_usermovies.append({"id":movie.movie_id,
                        "slug":movie.uniquename,
                        "name":movie.name,
                        "year":movie.year,
                        "video":movie.video_link,
                        "tags":[x.name for x in movie.tags],
                        "status":movie.status,
                        'username':User.query.filter_by(user_id=movie.user_id).first().username,
                        'saved':False})
    return(non_usermovies)

@basic_auth.verify_password
def verify_password(username, password):
    user = User.query.filter_by(username=username).first()
    if user is None:
        return False
    g.current_user = user
    return user.check_password(password)

@basic_auth.error_handler
def basic_auth_error():
    return jsonify({'movies':get_non_usermovies(), 'user':'', 'email':'', 'token':''}), 401

@token_auth.verify_token
def verify_token(token):
    g.current_user = User.check_token(token) if token else None
    return g.current_user is not None

@token_auth.error_handler
def token_auth_error():
    return jsonify({'movies':get_non_usermovies(), 'user':'', 'email':''}), 401

from flask import g, request, jsonify
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from app.models import User
from app import app, db
from app.models import Movie, Tag, User

basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()

@basic_auth.verify_password
def verify_password(username, password):
    user = User.query.filter_by(username=username).first()
    if user is None:
        return False
    g.current_user = user
    return user.check_password(password)

@basic_auth.error_handler
def basic_auth_error():
    nonusermovies = []
    for movie in Movie.query.all():
        nonusermovies.append({"id":movie.movie_id,
                        "slug":movie.uniquename,
                        "name":movie.name,
                        "year":movie.year,
                        "video":movie.video_link,
                        "tags":[x.name for x in movie.tags],
                        "status":movie.status,
                        'username':movie.username,
                        'saved':False})
    return jsonify({'movies':nonusermovies, 'user':'', 'token':''}), 401

@token_auth.verify_token
def verify_token(token):
    g.current_user = User.check_token(token) if token else None
    return g.current_user is not None

@token_auth.error_handler
def token_auth_error():
    nonusermovies = []
    for movie in Movie.query.all():
        nonusermovies.append({"id":movie.movie_id,
                        "slug":movie.uniquename,
                        "name":movie.name,
                        "year":movie.year,
                        "video":movie.video_link,
                        "tags":[x.name for x in movie.tags],
                        "status":movie.status,
                        'username':movie.username,
                        'saved':False})
    return jsonify({'movies':nonusermovies, 'user':''}), 401

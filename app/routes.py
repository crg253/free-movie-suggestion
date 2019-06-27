from flask import jsonify, render_template, request, g
from app import app, db, mail
from app.models import Movie, Tag, User
from app.auth import basic_auth, token_auth
from flask_mail import Message
import string
import random

def slugify(slug):
    to_remove = [' ', "'", ',', '!', '.', ':', '&', '-' ]
    for item in to_remove:
        slug = slug.replace(item, '')
    return slug

def getusermovies():
    usermovies = []
    for movie in Movie.query.all():
        usermovies.append({"id":movie.movie_id,
                        "slug":movie.uniquename,
                        "name":movie.name,
                        "year":movie.year,
                        "video":movie.video_link,
                        "tags":[x.name for x in movie.tags],
                        "status":movie.status,
                        'username':movie.username,
                        'saved':True if g.current_user in movie.savers else False })
    return(usermovies)

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
                        'username':movie.username,
                        'saved':False})
    return(non_usermovies)

@app.route('/api/removesuggestion', methods=['POST'])
@token_auth.login_required
def remove_suggestion():
    data=request.get_json(silent=True) or {}
    slug = data.get('slug')
    movie_to_unsuggest = Movie.query.filter_by(uniquename=data.get('slug')).first()
    user = User.query.filter_by(username=g.current_user.username).first()
    if movie_to_unsuggest in user.user_movies:
        db.session.delete(movie_to_unsuggest)
        db.session.commit()
    return jsonify({'movies':getusermovies(), 'user':g.current_user.username, 'email':g.current_user.email,}), 200

@app.route('/api/suggestmovie', methods=['POST'])
@token_auth.login_required
def suggest_movie():
    data=request.get_json(silent=True) or {}
    uniquename = slugify(data.get('title')).lower() +  data.get('year')
    title = data.get('title')
    year = data.get('year')
    user = User.query.filter_by(username=g.current_user.username).first()
    movie = Movie(uniquename=uniquename,name=title, year=year, username=user.username, status="pending")
    db.session.add(movie)
    db.session.commit()
    return jsonify({'movies':getusermovies(), 'user':g.current_user.username, 'email':g.current_user.email,}), 200

@app.route('/api/unsavemovie', methods=['POST'])
@token_auth.login_required
def unsavemovie():
    data=request.get_json(silent=True) or {}
    movie_to_unsave = Movie.query.filter_by(uniquename=data.get('slug')).first()
    g.current_user.saves.remove(movie_to_unsave)
    db.session.commit()
    return jsonify({'movies':getusermovies(), 'user':g.current_user.username, 'email':g.current_user.email,}), 200

@app.route('/api/savemovie', methods=['POST'])
@token_auth.login_required
def savemovie():
    data=request.get_json(silent=True) or {}
    movie_to_save = Movie.query.filter_by(uniquename=data.get('slug')).first()
    g.current_user.saves.append(movie_to_save)
    db.session.commit()
    return jsonify({'movies':getusermovies(), 'user':g.current_user.username, 'email':g.current_user.email,}), 200

@app.route('/api/deleteaccount', methods=['DELETE'])
@basic_auth.login_required
def delete_account():
    movies=Movie.query.filter_by(username=g.current_user.username)
    for m in movies:
        db.session.delete(m)
    user=User.query.filter_by(username=g.current_user.username).first()
    db.session.delete(user)
    db.session.commit()
    return jsonify({'movies':get_non_usermovies(), 'user':'', 'email':''}), 200

@app.route('/api/revoketoken', methods=['DELETE'])
@token_auth.login_required
def revoke_token():
    g.current_user.revoke_token()
    db.session.commit()
    return jsonify({'movies':get_non_usermovies(), 'user':'', 'email':''}), 200

@app.route('/api/updateaccount', methods=['POST'])
@token_auth.login_required
def update_account():
    data=request.get_json(silent=True) or {}
    user=User.query.filter_by(username=g.current_user.username).first()
    if data.get('newUserName'):
        user.username=data.get('newUserName')
    if data.get('newEmail'):
        user.email=data.get('newEmail')
    if data.get('newPassword'):
        user.set_password(data.get('newPassword'))
    db.session.commit()
    return jsonify({'movies':getusermovies(), 'user':g.current_user.username, 'email':g.current_user.email,}), 200

@app.route('/api/resetpassword', methods=['POST'])
def resetpassword():
    data=request.get_json(silent=True) or {}
    email=data.get('email')
    user = User.query.filter_by(email = email).first()
    if user == None:
        return jsonify({'':''}), 401
    else:
        chars = string.ascii_letters+string.digits+string.punctuation
        password = "".join(random.sample(chars, 8))
        user.set_password(password)
        db.session.commit()
        msg = Message(
            'Password Reset',
            sender = 'admin@freemoviesuggestion.com',
            recipients = [email]
            )
        msg.body = f"Your new password is {password}"
        mail.send(msg)
        return jsonify({'':''}),201

@app.route('/api/signin', methods=['POST'])
@basic_auth.login_required
def sign_in():
    token = g.current_user.get_token()
    db.session.commit()
    return jsonify({'user':g.current_user.username, 'email':g.current_user.email,'token':token, 'movies':getusermovies()}), 200

@app.route('/api/adduser', methods=['POST'])
def add_user():
    data=request.get_json(silent=True) or {}
    newUser = User(username=data.get('userName'))
    if data.get('email'):
        newUser.email=data.get('email')
    newUser.set_password(data.get('password'))
    db.session.add(newUser)
    db.session.commit()
    return jsonify({'':''}),201

@app.route('/api/checktoken', methods=['POST'])
@token_auth.login_required
def checktoken():
    return jsonify({'user':g.current_user.username, 'email':g.current_user.email, 'movies':getusermovies()}), 200

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return ('Change to render_template index')

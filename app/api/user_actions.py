from flask import jsonify, render_template, request, g, abort
from flask_mail import Message
from app import db, mail
from app.models import Movie, Tag, User
from app.api import bp
from app.api.auth import basic_auth, token_auth
import string
import random


def slugify(slug):
    to_remove = [" ", "'", ",", "!", ".", ":", "&", "-"]
    for item in to_remove:
        slug = slug.replace(item, "")
    return slug


@bp.route("/checktoken", methods=["POST"])
@token_auth.login_required
def checktoken():
    return (
        jsonify({"user": g.current_user.username, "email": g.current_user.email}),
        200,
    )


@bp.route("/get_movies", methods=["POST"])
def get_movies():
    data = request.get_json(silent=True) or {}
    user = User.query.filter_by(username=data.get("user")).first()
    movies = []
    for movie in Movie.query.all():
        movies.append(
            {
                "id": movie.movie_id,
                "slug": movie.uniquename,
                "name": movie.name,
                "year": movie.year,
                "video": movie.video_link,
                "tags": [x.name for x in movie.tags],
                "status": movie.status,
                "recommendedBy": movie.recommended_by.username,
                "saved": True if user in movie.savers else False,
            }
        )
    return jsonify({"movies": movies}), 200


@bp.route("/adduser", methods=["POST"])
def add_user():
    data = request.get_json(silent=True) or {}
    newUser = User(username=data.get("userName"))
    if data.get("email"):
        newUser.email = data.get("email")
    newUser.set_password(data.get("password"))
    db.session.add(newUser)
    db.session.commit()
    return "", 200


@bp.route("/signin", methods=["POST"])
@basic_auth.login_required
def sign_in():
    token = g.current_user.get_token()
    db.session.commit()
    return (
        jsonify(
            {
                "user": g.current_user.username,
                "email": g.current_user.email,
                "token": token,
            }
        ),
        200,
    )


@bp.route("/resetpassword", methods=["POST"])
def resetpassword():
    data = request.get_json(silent=True) or {}
    email = data.get("email")
    user = User.query.filter_by(email=email).first()
    if user == None:
        abort(401)
    else:
        chars = string.ascii_letters + string.digits + "@#$%&*"
        password = "".join(random.sample(chars, 6))
        user.set_password(password)
        db.session.commit()
        msg = Message(
            "Password Reset", sender="admin@freemoviesuggestion.com", recipients=[email]
        )
        msg.body = f"Your new password is {password}"
        mail.send(msg)
        return "", 200


@bp.route("/updateaccount", methods=["POST"])
@token_auth.login_required
def update_account():
    data = request.get_json(silent=True) or {}
    user = User.query.filter_by(username=g.current_user.username).first()
    if data.get("newUserName"):
        user.username = data.get("newUserName")
    if data.get("newEmail"):
        user.email = data.get("newEmail")
    if data.get("newPassword"):
        user.set_password(data.get("newPassword"))
    db.session.commit()
    return (
        jsonify({"user": g.current_user.username, "email": g.current_user.email}),
        200,
    )


@bp.route("/deleteaccount", methods=["DELETE"])
@basic_auth.login_required
def delete_account():
    movies = Movie.query.filter_by(recommended_by=g.current_user)
    for m in movies:
        db.session.delete(m)
    db.session.delete(g.current_user)
    db.session.commit()
    return "", 200


@bp.route("/savemovie", methods=["POST"])
@token_auth.login_required
def savemovie():
    data = request.get_json(silent=True) or {}
    movie_to_save = Movie.query.filter_by(uniquename=data.get("slug")).first()
    g.current_user.saves.append(movie_to_save)
    db.session.commit()
    return (
        jsonify({"user": g.current_user.username, "email": g.current_user.email}),
        200,
    )


@bp.route("/unsavemovie", methods=["POST"])
@token_auth.login_required
def unsavemovie():
    data = request.get_json(silent=True) or {}
    movie_to_unsave = Movie.query.filter_by(uniquename=data.get("slug")).first()
    g.current_user.saves.remove(movie_to_unsave)
    db.session.commit()
    return (
        jsonify({"user": g.current_user.username, "email": g.current_user.email}),
        200,
    )


@bp.route("/suggestmovie", methods=["POST"])
@token_auth.login_required
def suggest_movie():
    data = request.get_json(silent=True) or {}
    uniquename = slugify(data.get("title")).lower() + data.get("year")
    title = data.get("title")
    year = data.get("year")
    user_id = g.current_user.user_id
    movie = Movie(
        uniquename=uniquename,
        name=title,
        year=year,
        recommender_id=user_id,
        status="pending",
    )
    db.session.add(movie)
    db.session.commit()
    return (
        jsonify({"user": g.current_user.username, "email": g.current_user.email}),
        200,
    )


@bp.route("/removesuggestion", methods=["POST"])
@token_auth.login_required
def remove_suggestion():
    data = request.get_json(silent=True) or {}
    slug = data.get("slug")
    movie_to_unsuggest = Movie.query.filter_by(uniquename=data.get("slug")).first()
    user = User.query.filter_by(username=g.current_user.username).first()
    if movie_to_unsuggest in user.recommendations:
        db.session.delete(movie_to_unsuggest)
        db.session.commit()
        return (
            jsonify({"user": g.current_user.username, "email": g.current_user.email}),
            200,
        )
    else:
        return "", 401

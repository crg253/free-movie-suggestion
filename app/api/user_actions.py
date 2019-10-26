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


@bp.route("/getuser", methods=["POST"])
def get_user():
    # pass token to this route directly
    data = request.get_json(silent=True) or {}
    user = User.check_token(data.get("token"))
    if user == None:
        return (jsonify({"user": {"name": "", "email": ""}}), 200)
    else:
        return (jsonify({"user": {"name": user.name, "email": user.email}}), 200)


@bp.route("/getmovies", methods=["POST"])
def get_movies():
    # pass token to this route directly
    data = request.get_json(silent=True) or {}
    user = User.check_token(data.get("token"))
    movies = []
    for movie in Movie.query.all():
        movies.append(
            {
                "id": movie.id,
                "slug": movie.slug,
                "title": movie.title,
                "year": movie.year,
                "video": movie.video_link,
                "tags": [x.name for x in movie.tags],
                "recommendedBy": movie.recommended_by.name,
                "saved": True if user in movie.savers else False,
            }
        )
    return jsonify({"movies": movies}), 200


@bp.route("/createaccount", methods=["POST"])
def create_account():
    data = request.get_json(silent=True) or {}
    if len(data.get("name")) == 0 or len(data.get("password")) < 6:
        abort(400)
    new_user = User(name=data.get("name"))
    if data.get("email"):
        new_user.email = data.get("email")
    new_user.set_password(data.get("password"))
    db.session.add(new_user)
    db.session.commit()
    return "", 200


@bp.route("/signin", methods=["POST"])
@basic_auth.login_required
def sign_in():
    token = g.current_user.get_token()
    db.session.commit()
    return (jsonify({"token": token, "name": g.current_user.name}), 200)


@bp.route("/resetpassword", methods=["POST"])
def reset_password():
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


@bp.route("/editaccount", methods=["POST"])
@token_auth.login_required
def edit_account():
    data = request.get_json(silent=True) or {}
    user = User.query.filter_by(name=g.current_user.name).first()
    if data.get("newName"):
        user.name = data.get("newName")
    if data.get("newEmail"):
        user.email = data.get("newEmail")
    if data.get("newPassword"):
        if len(data.get("newPassword")) < 6:
            abort(400)
        else:
            user.set_password(data.get("newPassword"))
    db.session.commit()
    return "", 200


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
def save_movie():
    data = request.get_json(silent=True) or {}
    movie_to_save = Movie.query.filter_by(slug=data.get("slug")).first()
    g.current_user.saves.append(movie_to_save)
    db.session.commit()
    return "", 200


@bp.route("/unsavemovie", methods=["POST"])
@token_auth.login_required
def unsave_movie():
    data = request.get_json(silent=True) or {}
    movie_to_unsave = Movie.query.filter_by(slug=data.get("slug")).first()
    g.current_user.saves.remove(movie_to_unsave)
    db.session.commit()
    return "", 200


@bp.route("/suggestmovie", methods=["POST"])
@token_auth.login_required
def suggest_movie():
    data = request.get_json(silent=True) or {}
    slug = slugify(data.get("title")).lower() + data.get("year")
    title = data.get("title")
    year = data.get("year")
    movie = Movie(slug=slug, title=title, year=year, recommender_id=g.current_user.id)
    db.session.add(movie)
    db.session.commit()
    msg = Message(
        "New Suggestion",
        sender="admin@freemoviesuggestion.com",
        recipients=["admin@freemoviesuggestion.com"],
    )
    msg.body = (
        g.current_user.name
        + " recommended "
        + data.get("title")
        + " "
        + data.get("year")
    )
    mail.send(msg)
    return "", 200


@bp.route("/removesuggestion", methods=["POST"])
@token_auth.login_required
def remove_suggestion():
    data = request.get_json(silent=True) or {}
    slug = data.get("slug")
    movie_to_unsuggest = Movie.query.filter_by(slug=data.get("slug")).first()
    user = User.query.filter_by(name=g.current_user.name).first()
    if movie_to_unsuggest in user.recommendations:
        db.session.delete(movie_to_unsuggest)
        db.session.commit()
        return "", 200
    else:
        return "", 401

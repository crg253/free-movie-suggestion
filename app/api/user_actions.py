from flask import jsonify, render_template, request, g, abort, url_for, current_app
from flask_mail import Message
from app import db, mail
from app.models import Movie, Tag, User
from app.schemas import (
    EmailSchema,
    NameSchema,
    PasswordSchema,
    SlugSchema,
    UserSchema,
    ResetPasswordSchema,
    MovieSchema,
)
from app.api import bp
from app.api.auth import basic_auth, token_auth
import string
import random
from types import *
from itsdangerous import URLSafeTimedSerializer
import os
import json
from marshmallow import ValidationError


def slugify(slug):
    to_remove = [" ", "'", ",", "!", ".", ":", "&", "-"]
    for item in to_remove:
        slug = slug.replace(item, "")
    return slug.lower()


@bp.route("/getuser", methods=["POST"])
def get_user():
    # pass token to this route directly instead of token_auth
    data = request.get_json(silent=True) or {}
    user = User.check_token(data.get("token"))
    # worst case data, user == None
    if user == None:
        return (jsonify({"user": {"name": "", "email": ""}}), 200)
    else:
        if user.email:
            return (jsonify({"user": {"name": user.name, "email": user.email}}), 200)
        else:
            return (jsonify({"user": {"name": user.name, "email": ""}}), 200)


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


@bp.route("/submitemail", methods=["POST"])
def submit_email():
    json_data = request.get_json(silent=True) or {}
    # validate email
    try:
        data = EmailSchema().load(json_data)
    except:
        return "", 200
    # if email not being used then send link
    email = data["email"]
    email_user = User.query.filter_by(email=email).first()
    if email_user == None:
        ts = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
        email_token = ts.dumps(email, salt=current_app.config["EMAIL_CONFIRM_SALT"])
        confirm_url = url_for(
            "main.confirm_email", email_token=email_token, _external=True
        )
        msg = Message(
            "Confirm your email",
            sender="admin@freemoviesuggestion.com",
            recipients=[email],
        )
        msg.body = f"Click to confirm email and activate account: {confirm_url}"
        mail.send(msg)
        return "", 200
    else:
        return "", 200


@bp.route("/completeregistration", methods=["POST"])
def create_account():
    json_data = request.get_json(silent=True) or {}
    ts = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
    token = json_data.get("emailToken")
    try:
        email = ts.loads(
            token, salt=current_app.config["EMAIL_CONFIRM_SALT"]  # max_age=86400
        )
    except:
        abort(400)
    name = json_data.get("name")
    password = json_data.get("password")
    new_user_data = {"name": name, "email": email, "password": password}
    print(new_user_data)
    try:
        data = UserSchema().load(new_user_data)
    except:
        abort(400)
    new_user = User(email=data["email"], name=data["name"])
    new_user.set_password(data["password"])
    db.session.add(new_user)
    try:
        db.session.commit()
    except:
        abort(500)
    return "", 200


@bp.route("/signin", methods=["POST"])
@basic_auth.login_required
def sign_in():
    token = g.current_user.get_token()
    db.session.commit()
    return (jsonify({"token": token, "name": g.current_user.name}), 200)


@bp.route("/resetpasswordemail", methods=["POST"])
def reset_password():
    json_data = request.get_json(silent=True) or {}
    try:
        data = EmailSchema().load(json_data)
    except:
        return "", 200
    email = data["email"]
    email_user = User.query.filter_by(email=email).first()
    if email_user != None:
        ts = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
        email_token = ts.dumps(email, salt=current_app.config["EMAIL_CONFIRM_SALT"])
        reset_url = url_for(
            "main.complete_reset_password", email_token=email_token, _external=True
        )
        msg = Message(
            "Reset your password.",
            sender="admin@freemoviesuggestion.com",
            recipients=[email],
        )
        msg.body = f"Click to reset your password: {reset_url}"
        mail.send(msg)
    else:
        return "", 200

    return "", 200


@bp.route("/completepasswordreset", methods=["POST"])
def complete_password_reset():
    json_data = request.get_json(silent=True) or {}
    token = json_data.get("emailToken")
    ts = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
    try:
        email = ts.loads(
            token, salt=current_app.config["EMAIL_CONFIRM_SALT"]  # max_age=86400
        )
    except:
        abort(400)
    password = json_data.get("password")
    user_data = {"email": email, "password": password}
    try:
        data = ResetPasswordSchema().load(user_data)
    except:
        abort(400)
    user = User.query.filter_by(email=data["email"]).first()
    if user != None:
        user.set_password(data["password"])
        db.session.commit()
        return "", 200
    else:
        abort(500)


@bp.route("/editaccount", methods=["POST"])
@token_auth.login_required
def edit_account():
    json_data = request.get_json(silent=True) or {}
    user = g.current_user

    new_name = {"name": json_data.get("newName")}
    new_email = {"email": json_data.get("newEmail")}
    new_password = {"password": json_data.get("newPassword")}

    try:
        name_data = NameSchema().load(new_name)
        user.name = name_data["name"]
    except:
        pass
    try:
        email_data = EmailSchema().load(new_email)
        user.email = email_data["email"]
    except:
        pass
    try:
        password_data = PasswordSchema().load(new_password)
        user.set_password(password_data["password"])
    except:
        pass

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
    json_data = request.get_json(silent=True) or {}
    movie = Movie.query.filter_by(slug=json_data.get("slug")).first()
    # any type of data here produces movie object or None
    if movie is not None:
        if movie in g.current_user.saves:
            abort(500)
        else:
            g.current_user.saves.append(movie)
            db.session.commit()
            return "", 200


@bp.route("/unsavemovie", methods=["POST"])
@token_auth.login_required
def unsave_movie():
    json_data = request.get_json(silent=True) or {}
    movie = Movie.query.filter_by(slug=json_data.get("slug")).first()
    if movie is not None:
        if movie not in g.current_user.saves:
            abort(500)
        else:
            g.current_user.saves.remove(movie)
            db.session.commit()
            return "", 200


@bp.route("/suggestmovie", methods=["POST"])
@token_auth.login_required
def suggest_movie():
    json_data = request.get_json(silent=True) or {}
    try:
        # validate title and year as strings
        data = MovieSchema().load(json_data)
    except:
        abort(400)
    # prepare data for Movie model
    title = data["title"]
    year_string = data["year"]
    slug = slugify(title + year_string)
    try:
        # convert year to integer
        year = int(data["year"])
    except:
        abort(400)
    try:
        # add to db ... check for uniqueness
        movie = Movie(
            slug=slug, title=title, year=year, recommender_id=g.current_user.id
        )
        db.session.add(movie)
        db.session.commit()
    except:
        abort(500)
    try:
        # send myself a message
        msg = Message(
            "New Suggestion",
            sender="admin@freemoviesuggestion.com",
            recipients=["admin@freemoviesuggestion.com"],
        )
        msg.body = g.current_user.name + " recommended " + title + " " + year_string
        mail.send(msg)
    except:
        pass

    return "", 200


@bp.route("/removesuggestion", methods=["POST"])
@token_auth.login_required
def remove_suggestion():
    json_data = request.get_json(silent=True) or {}
    slug = json_data.get("slug")
    movie_to_unsuggest = Movie.query.filter_by(slug=slug).first()
    if movie_to_unsuggest is None:
        abort(500)
    if movie_to_unsuggest not in g.current_user.recommendations:
        abort(500)
    else:
        db.session.delete(movie_to_unsuggest)
        db.session.commit()
        return "", 200

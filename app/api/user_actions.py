from flask import jsonify, render_template, request, g, abort, url_for
from flask_mail import Message
from app import db, mail
from app.models import Movie, Tag, User
from app.forms import (
    CreateAccountForm,
    CheckEmailForm,
    ChangeNameForm,
    ChangeEmailForm,
    ChangePasswordForm,
    SaveMovieForm,
    UnsaveMovieForm,
    SuggestMovieForm,
    RemoveSuggestionForm,
    ResetPasswordForm,
)
from app.schemas import EmailSchema, NewUserSchema
from app.api import bp
from app.api.auth import basic_auth, token_auth
import string
import random
from types import *
from itsdangerous import URLSafeTimedSerializer
import os
import json


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
    data = request.get_json(silent=True) or {}
    email_schema = EmailSchema()
    errors = email_schema.validate(data)
    if errors:
        # fail 1: email data is wrong format or type
        abort(400)
    else:
        # pass 1: email data is good
        email = data.get("email")
        # not sure if this is ok ... should I be pulling data out of schema instead?
        email_user = User.query.filter_by(email=email).first()

        if email_user == None:
            # pass 2: email data is good and hasn't been used
            ts = URLSafeTimedSerializer(os.environ.get("SECRET_KEY"))
            email_token = ts.dumps(email, salt=os.environ.get("EMAIL-CONFIRM-SALT"))
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
            # fail 2: email already being used
            abort(500)


@bp.route("/completeregistration", methods=["POST"])
def create_account():
    data = request.get_json(silent=True) or {}

    # get email data
    token = data.get("emailToken")
    ts = URLSafeTimedSerializer(os.environ.get("SECRET_KEY"))
    try:
        email = ts.loads(
            token, salt=os.environ.get("EMAIL-CONFIRM-SALT")  # max_age=86400
        )
    except:
        abort(400)

    # get name and password
    name = data.get("name")
    password = data.get("password")

    # validate all data
    user_data = {"email": email, "name": name, "password": password}
    try:
        NewUserSchema().load(user_data)
    except:
        abort(400)

    new_user = User(email=email, name=name)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    return "", 200


@bp.route("/signin", methods=["POST"])
@basic_auth.login_required
def sign_in():
    token = g.current_user.get_token()
    db.session.commit()
    return (jsonify({"token": token, "name": g.current_user.name}), 200)


@bp.route("/resetpasswordemail", methods=["POST"])
def reset_password():
    data = request.get_json(silent=True) or {}
    email = data.get("email")
    form = CheckEmailForm(email=email)
    if form.validate():
        email_user = User.query.filter_by(email=email).first()
        if email_user != None:
            ts = URLSafeTimedSerializer(os.environ.get("SECRET_KEY"))
            email_token = ts.dumps(email, salt=os.environ.get("EMAIL-CONFIRM-SALT"))
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

            return "", 200
        else:
            abort(500)
    else:
        abort(400)


@bp.route("/completepasswordreset", methods=["POST"])
def complete_password_reset():
    data = request.get_json(silent=True) or {}
    token = data.get("emailToken")
    ts = URLSafeTimedSerializer(os.environ.get("SECRET_KEY"))
    try:
        email = ts.loads(
            token, salt=os.environ.get("EMAIL-CONFIRM-SALT")  # max_age=86400
        )
    except:
        abort(400)

    form = ResetPasswordForm(email=email, password=data.get("password"))
    if form.validate():
        user = User.query.filter_by(email=email).first()
        user.set_password(form.password.data)
        db.session.commit()

        return "", 200
    else:
        return "", 400


@bp.route("/editaccount", methods=["POST"])
@token_auth.login_required
def edit_account():
    data = request.get_json(silent=True) or {}
    user = g.current_user

    new_name = data.get("newName")
    change_name_form = ChangeNameForm(name=new_name)
    new_email = data.get("newEmail")
    change_email_form = ChangeEmailForm(email=new_email)
    new_password = data.get("newPassword")
    change_password_form = ChangePasswordForm(password=new_password)

    if (
        change_name_form.validate()
        or change_email_form.validate()
        or change_password_form.validate()
    ):

        if change_name_form.validate():
            user.name = new_name

        if change_email_form.validate():
            user.email = new_email

        if change_password_form.validate():
            user.set_password(new_password)

        db.session.commit()
        return "", 200
    else:
        abort(400)


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
    slug = data.get("slug")
    form = SaveMovieForm(slug=slug)
    if form.validate():
        movies_to_save = Movie.query.filter_by(slug=slug).all()
        if len(movies_to_save) > 1 or len(movies_to_save) == 0:
            abort(500)
        if movies_to_save[0] in g.current_user.saves:
            abort(500)
        else:
            g.current_user.saves.append(movies_to_save[0])
            db.session.commit()
            return "", 200
    else:
        abort(400)


@bp.route("/unsavemovie", methods=["POST"])
@token_auth.login_required
def unsave_movie():
    data = request.get_json(silent=True) or {}
    slug = data.get("slug")
    form = UnsaveMovieForm(slug=slug)
    if form.validate():
        movies_to_unsave = Movie.query.filter_by(slug=slug).all()
        if len(movies_to_unsave) > 1 or len(movies_to_unsave) == 0:
            abort(500)
        if movies_to_unsave[0] not in g.current_user.saves:
            abort(500)
        else:
            g.current_user.saves.remove(movies_to_unsave[0])
            db.session.commit()
            return "", 200
    else:
        abort(400)


@bp.route("/suggestmovie", methods=["POST"])
@token_auth.login_required
def suggest_movie():
    data = request.get_json(silent=True) or {}
    title = data.get("title")
    year = data.get("year")
    form = SuggestMovieForm(title=title, year=year)
    if form.validate():
        slug = slugify(data.get("title")).lower() + data.get("year")
        movie = Movie(
            slug=slug, title=title, year=year, recommender_id=g.current_user.id
        )
        db.session.add(movie)
        db.session.commit()
        try:
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
        except:
            print("No email connection")
        return "", 200
    else:
        abort(400)


@bp.route("/removesuggestion", methods=["POST"])
@token_auth.login_required
def remove_suggestion():
    data = request.get_json(silent=True) or {}
    slug = data.get("slug")
    form = RemoveSuggestionForm(slug=slug)
    if form.validate():
        movies_to_unsuggest = Movie.query.filter_by(slug=slug).all()
        if len(movies_to_unsuggest) > 1 or len(movies_to_unsuggest) == 0:
            abort(500)
        if movies_to_unsuggest[0] not in g.current_user.recommendations:
            abort(500)
        else:
            db.session.delete(movies_to_unsuggest[0])
            db.session.commit()
            return "", 200
    else:
        abort(400)

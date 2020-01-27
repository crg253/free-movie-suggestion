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
)
from app.api import bp
from app.api.auth import basic_auth, token_auth
import string
import random
from types import *
from itsdangerous import URLSafeTimedSerializer
import os


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


@bp.route("/createaccount", methods=["POST"])
def create_account():
    data = request.get_json(silent=True) or {}
    form = CreateAccountForm(
        name=data.get("name"), email=data.get("email"), password=data.get("password")
    )
    if form.validate():
        new_user = User(
            name=form.name.data, email=form.email.data, email_confirmed=False
        )
        new_user.set_password(form.password.data)
        db.session.add(new_user)
        db.session.commit()

        # Send email confirmation link
        ts = URLSafeTimedSerializer(os.environ.get("SECRET_KEY"))
        token = ts.dumps(new_user.email, salt=os.environ.get("EMAIL-CONFIRM-SALT"))
        confirm_url = url_for("main.catch_all", token=token, _external=True)
        msg = Message(
            "Confirm your email",
            sender="admin@freemoviesuggestion.com",
            recipients=[new_user.email],
        )
        msg.body = f"Click to confirm email and activate account: {confirm_url}"
        mail.send(msg)

        return "", 200
    else:
        return "", 400


@bp.route("/confirm/<token>")
def confirm_email(token):
    try:
        email = ts.loads(
            token, salt=os.environ.get("EMAIL-CONFIRM-SALT"), max_age=86400
        )
    except:
        abort(404)
    user = User.query.filter_by(email=email).first_or_404()
    user.email_confirmed = True
    db.session.add(user)
    db.session.commit()
    return "", 200


@bp.route("/signin", methods=["POST"])
@basic_auth.login_required
def sign_in():
    token = g.current_user.get_token()
    db.session.commit()
    return (jsonify({"token": token, "name": g.current_user.name}), 200)


# /resetpassword


def try_email_new_password_to_user(email, password):
    try:
        msg = Message(
            "Password Reset", sender="admin@freemoviesuggestion.com", recipients=[email]
        )
        msg.body = f"Your new password is {password}"
        mail.send(msg)
    except:
        abort(500)


def lookup_user_abort_find_zero_or_many(email):
    users = User.query.filter_by(email=email).all()
    if len(users) > 1:
        abort(500)
    elif len(users) == 0:
        abort(401)


def create_new_password():
    chars = string.ascii_letters + string.digits + "@#$%&*"
    password = "".join(random.sample(chars, 6))
    return password


def validate_email_input(email):
    form = CheckEmailForm(email=email)
    if form.validate():
        pass
    else:
        abort(400)


@bp.route("/resetpassword", methods=["POST"])
def reset_password():
    data = request.get_json(silent=True) or {}
    email = email = data.get("email")
    validate_email_input(email)
    lookup_user_abort_find_zero_or_many(email)
    user = User.query.filter_by(email=email).first()
    password = create_new_password()
    try_email_new_password_to_user(email, password)
    user.set_password(password)
    db.session.commit()
    return "", 200


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

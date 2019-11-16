from flask import g, abort
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from app.models import User
from app.forms import SignInForm
from app import db


basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()


@basic_auth.verify_password
def verify_password(name, password):
    form = SignInForm(name=name, password=password)
    if form.validate():
        users_list = User.query.filter_by(name=name).all()
        if len(users_list) > 1:
            print("too many users found")
            abort(500)
        elif len(users_list) == 0:
            print("no user found")
            return False
        else:
            print("one user found")
            user = users_list[0]
            g.current_user = user
            return user.check_password(password)
    else:
        print("bad data")
        abort(400)


@basic_auth.error_handler
def basic_auth_error():
    print("no user found or bad password")
    abort(401)


@token_auth.verify_token
def verify_token(token):
    g.current_user = User.check_token(token) if token else None
    return g.current_user is not None


@token_auth.error_handler
def token_auth_error():
    abort(401)

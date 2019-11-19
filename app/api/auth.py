from flask import g, abort
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from app.models import User
from app.forms import SignInForm, TokenForm
from app import db


basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()


@basic_auth.verify_password
def verify_password(name, password):
    form = SignInForm(name=name, password=password)
    if form.validate():
        all_users = User.query.filter_by(name=name).all()
        if len(all_users) > 1:
            abort(500)
        elif len(all_users) == 0:
            return False
        else:
            user = all_users[0]
            g.current_user = user
            return user.check_password(password)
    else:
        abort(400)


@basic_auth.error_handler
def basic_auth_error():
    abort(401)


@token_auth.verify_token
def verify_token(token):
    form = TokenForm(token=token)
    if form.validate():
        g.current_user = User.check_token(token)
        return g.current_user is not None
    else:
        False


@token_auth.error_handler
def token_auth_error():
    abort(401)

from flask import g, abort
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from app.models import User
from app import db


basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()


@basic_auth.verify_password
def verify_password(name, password):
    # should never need next 2 lines in normal usage
    if name is None or len(name) == 0 or password is None or len(password) < 6:
        abort(400)
    user = User.query.filter_by(name=name).first()
    if user is None:
        return False
    g.current_user = user
    return user.check_password(password)


@basic_auth.error_handler
def basic_auth_error():
    abort(401)


@token_auth.verify_token
def verify_token(token):
    g.current_user = User.check_token(token) if token else None
    return g.current_user is not None


@token_auth.error_handler
def token_auth_error():
    abort(401)

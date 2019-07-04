from flask import g, request, jsonify
from app.models import User
from app import app, db, basic_auth, token_auth
from app.models import Movie, Tag, User


@basic_auth.verify_password
def verify_password(username, password):
    user = User.query.filter_by(username=username).first()
    if user is None:
        return False
    g.current_user = user
    return user.check_password(password)

@basic_auth.error_handler
def basic_auth_error():
    return jsonify({'user':'', 'email':'', 'token':''}), 401

@token_auth.verify_token
def verify_token(token):
    g.current_user = User.check_token(token) if token else None
    return g.current_user is not None

@token_auth.error_handler
def token_auth_error():
    return jsonify({'user':'', 'email':''}), 401

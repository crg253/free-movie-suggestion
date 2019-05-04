from flask import g, request
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from app.models import User
#import error_response

basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()

@basic_auth.verify_password
def verify_password(username, password):
    print('basic sign in auth')
    user = User.query.filter_by(username=username).first()
    if user is None:
        return False
    g.current_user = user
    print(user.check_password(password))
    return user.check_password(password)

# @basic_auth.error_handler
# def basic_auth_error():
#     return error_response(401)

@token_auth.verify_token
def verify_token(token):
    print('token auth')
    g.current_user = User.check_token(token) if token else None
    print(g.current_user is not None)
    return g.current_user is not None

# @token_auth.error_handler
# def token_auth_error():
#     return error_response(401)
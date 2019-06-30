from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_mail import Mail
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth

# app = Flask(__name__,
#     static_folder='../react-frontend/build/static',
#     template_folder="../react-frontend/build")
app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()
mail = Mail(app)

from app import routes, models

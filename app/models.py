from app import db
from werkzeug.security import generate_password_hash, check_password_hash
import base64
from datetime import datetime, timedelta
import os

tags = db.Table('tags',
    db.Column('movie_id', db.Integer, db.ForeignKey('movie.movie_id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.tag_id'), primary_key=True)
)

savers = db.Table('savers',
    db.Column('movie_id', db.Integer, db.ForeignKey('movie.movie_id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('user.user_id'), primary_key=True)
)

class Movie(db.Model):
    movie_id = db.Column(db.Integer, primary_key=True)
    uniquename = db.Column(db.String(200), unique=True)
    name = db.Column(db.String(200))
    year = db.Column(db.Integer)
    video_link = db.Column(db.String(1000))
    tags = db.relationship('Tag', secondary=tags, lazy='subquery',
        backref=db.backref('movies', lazy=True))
    status = db.Column(db.String(20))
    username = db.Column(db.Integer, db.ForeignKey('user.username'), nullable=False)
    savers = db.relationship('User', secondary=savers, lazy='subquery',
        backref=db.backref('saves', lazy=True))

class Tag(db.Model):
    tag_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), unique=True)

class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    token = db.Column(db.String(32), index=True, unique=True)
    token_expiration = db.Column(db.DateTime)
    user_movies = db.relationship('Movie', backref="user", lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_token(self, expires_in=1800):
        now = datetime.utcnow()
        if self.token and self.token_expiration > now + timedelta(seconds=60):
            return self.token
        self.token =  base64.b64encode(os.urandom(24)).decode('utf-8')
        self.token_expiration = now + timedelta(seconds=expires_in)
        db.session.add(self)
        return self.token

    def revoke_token(self):
        self.token_expiration = datetime.utcnow() - timedelta(seconds=1)

    @staticmethod
    def check_token(token):
        user = User.query.filter_by(token=token).first()
        if user is None or user.token_expiration < datetime.utcnow():
            return None
        return user

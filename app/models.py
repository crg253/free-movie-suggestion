from app import db

#Many to many

tags = db.Table('tags',
    db.Column('movie_id', db.Integer, db.ForeignKey('movie.movie_id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.tag_id'), primary_key=True)
)

class Movie(db.Model):
    movie_id = db.Column(db.Integer, primary_key=True)
    uniquename = db.Column(db.String(200))
    name = db.Column(db.String(200))
    year = db.Column(db.Integer)
    video_link = db.Column(db.String(1000))
    tags = db.relationship('Tag', secondary=tags, lazy='subquery',
        backref=db.backref('movies', lazy=True))

class Tag(db.Model):
    tag_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200))

class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)

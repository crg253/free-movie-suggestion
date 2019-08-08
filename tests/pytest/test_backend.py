import pytest

import os
import sys

sys.path.append(os.path.abspath("../../"))

from app import create_app, db
from app.models import Movie, Tag, User
from app.api.auth import verify_password, verify_token
from config import Config

import base64
import json
from data_loader.csv_loader import *


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite://"
    ELASTICSEARCH_URL = None


@pytest.fixture(scope="module")
def test_client():
    app = create_app(TestConfig)
    client = app.test_client()
    ctx = app.app_context()
    ctx.push()
    yield client
    ctx.pop()


@pytest.fixture(scope="module")
def init_db():
    db.create_all()

    # create three users
    monkey = User(username="monkey")
    monkey.set_password("monkeypassword")
    monkey.get_token()
    bella = User(username="bella")
    bella.set_password("bellapassword")
    bella.get_token()
    hazel = User(username="hazel")
    hazel.set_password("hazelpassword")
    hazel.get_token()
    # each user creates one movie
    movie_1 = Movie(uniquename="movie_1", name="Movie 1", year=2019, recommender_id=1)
    movie_2 = Movie(uniquename="movie_2", name="Movie 2", year=2019, recommender_id=2)
    movie_3 = Movie(uniquename="movie_3", name="Movie 3", year=2019, recommender_id=3)
    # create three tags
    action = Tag(name="Action")
    comedy = Tag(name="Comedy")
    documentary = Tag(name="Documentarty")
    db.session.add(monkey)
    db.session.add(bella)
    db.session.add(hazel)
    db.session.add(movie_1)
    db.session.add(movie_2)
    db.session.add(movie_3)
    db.session.add(action)
    db.session.add(comedy)
    db.session.add(documentary)
    db.session.commit()

    yield db
    db.drop_all()

""" Test DB Relationships """

# Movie Recommender One-to_Many


def test_movie_recommender_id_property_creates_one_to_many(
    test_client, init_db
):
    movie_1 = Movie.query.filter_by(uniquename='movie_1').first()
    monkey = User.query.filter_by(username='monkey').first()
    # check user.recommendations array contains whole movie object
    assert movie_1 in monkey.recommendations
    # full circle, check movie.recommended_by contains whole user object
    assert movie_1.recommended_by == monkey

# Movie Tags Many-to-Many

def test_movie_tags_array_creates_many_to_many(test_client, init_db):

    movie_1 = Movie.query.filter_by(uniquename='movie_1').first()
    movie_2 = Movie.query.filter_by(uniquename='movie_2').first()
    movie_3 = Movie.query.filter_by(uniquename='movie_3').first()
    action = Tag.query.filter_by(name="Action").first()
    comedy = Tag.query.filter_by(name="Comedy").first()
    documentary = Tag.query.filter_by(name="Documentarty").first()

    movie_1.tags.append(action)
    movie_1.tags.append(comedy)
    movie_2.tags.append(comedy)
    movie_2.tags.append(documentary)
    movie_3.tags.append(documentary)
    movie_3.tags.append(action)

    # check the tag.movies array
    assert movie_1 in action.movies
    assert movie_1 in comedy.movies
    assert movie_2 in comedy.movies
    assert movie_2 in documentary.movies
    assert movie_3 in documentary.movies
    assert movie_3 in action.movies

    db.session.remove()

def test_tag_movies_array_creates_many_to_many(test_client, init_db):

    movie_1 = Movie.query.filter_by(uniquename='movie_1').first()
    movie_2 = Movie.query.filter_by(uniquename='movie_2').first()
    movie_3 = Movie.query.filter_by(uniquename='movie_3').first()
    action = Tag.query.filter_by(name="Action").first()
    comedy = Tag.query.filter_by(name="Comedy").first()
    documentary = Tag.query.filter_by(name="Documentarty").first()

    action.movies.append(movie_1)
    action.movies.append(movie_2)
    comedy.movies.append(movie_2)
    comedy.movies.append(movie_3)
    documentary.movies.append(movie_3)
    documentary.movies.append(movie_1)

    # check movie.tags array
    assert action in movie_1.tags
    assert documentary in movie_1.tags
    assert action in movie_2.tags
    assert comedy in movie_2.tags
    assert comedy in movie_3.tags
    assert documentary in movie_3.tags

    db.session.remove()

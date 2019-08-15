import pytest

import os
import sys

sys.path.append(os.path.abspath("../"))
basedir = os.path.abspath(os.path.dirname(__file__))

from app import create_app, db
from app.models import Movie, Tag, User
from app.api.auth import verify_password, verify_token
from config import Config

import base64
import json
from data_loader.csv_loader import *


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(basedir, "test_db_models.db")
    ELASTICSEARCH_URL = None


@pytest.fixture(scope="module")
def test_client():
    app = create_app(TestConfig)
    client = app.test_client()
    ctx = app.app_context()
    ctx.push()
    yield client
    ctx.pop()


@pytest.fixture(scope="function")
def init_db():
    db.create_all()
    yield db
    db.drop_all()


def create_users_movies_and_tags():

    # create three users
    monkey = User(name="monkey")
    monkey.set_password("monkeypassword")
    monkey.get_token()
    bella = User(name="bella")
    bella.set_password("bellapassword")
    bella.get_token()
    hazel = User(name="hazel")
    hazel.set_password("hazelpassword")
    hazel.get_token()
    # each user creates one movie
    movie_1 = Movie(slug="movie_1", title="Movie 1", year=2019, recommender_id=1)
    movie_2 = Movie(slug="movie_2", title="Movie 2", year=2019, recommender_id=2)
    movie_3 = Movie(slug="movie_3", title="Movie 3", year=2019, recommender_id=3)
    # create three tags
    action = Tag(name="Action")
    comedy = Tag(name="Comedy")
    documentary = Tag(name="Documentarty")

    db.session.add_all(
        [monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary]
    )
    db.session.commit()
    return (
        monkey,
        bella,
        hazel,
        movie_1,
        movie_2,
        movie_3,
        action,
        comedy,
        documentary,
    )


""" Test DB Relationships """

# Movie Recommender One-to_Many


def test_movie_recommender_id_property_creates_one_to_many(test_client, init_db):
    monkey = User(name="monkey")
    monkey.set_password("monkeypassword")
    movie_1 = Movie(slug="movie_1", title="Movie 1", year=2019, recommender_id=1)
    db.session.add_all([monkey, movie_1])
    db.session.commit()
    # check user.recommendations array contains whole movie object
    assert movie_1 in monkey.recommendations
    # full circle, check movie.recommended_by contains whole user object
    assert movie_1.recommended_by == monkey


# Movie Tags Many-to-Many


def test_movie_tags_array_creates_many_to_many(test_client, init_db):
    monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
        create_users_movies_and_tags()
    )

    movie_1.tags.append(action)
    movie_1.tags.append(comedy)
    movie_2.tags.append(comedy)
    movie_2.tags.append(documentary)
    movie_3.tags.append(documentary)
    movie_3.tags.append(action)
    db.session.commit()
    # check the tag.movies array
    assert movie_1 in action.movies
    assert movie_1 in comedy.movies
    assert movie_2 in comedy.movies
    assert movie_2 in documentary.movies
    assert movie_3 in documentary.movies
    assert movie_3 in action.movies


def test_tag_movies_array_creates_many_to_many(test_client, init_db):
    monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
        create_users_movies_and_tags()
    )

    action.movies.append(movie_1)
    action.movies.append(movie_2)
    comedy.movies.append(movie_2)
    comedy.movies.append(movie_3)
    documentary.movies.append(movie_3)
    documentary.movies.append(movie_1)
    db.session.commit()

    # check movie.tags array
    assert action in movie_1.tags
    assert documentary in movie_1.tags
    assert action in movie_2.tags
    assert comedy in movie_2.tags
    assert comedy in movie_3.tags
    assert documentary in movie_3.tags


# Saved Movies Many-to-Many


def test_movie_savers_array_creates_many_to_many(test_client, init_db):
    monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
        create_users_movies_and_tags()
    )
    # include owner to movie.savers
    movie_1.savers.append(monkey)
    movie_1.savers.append(bella)
    movie_2.savers.append(bella)
    movie_2.savers.append(hazel)
    movie_3.savers.append(hazel)
    movie_3.savers.append(monkey)
    db.session.commit()
    # check user.saves array
    assert movie_1 in monkey.saves
    assert movie_3 in monkey.saves
    assert movie_1 in bella.saves
    assert movie_2 in bella.saves
    assert movie_2 in hazel.saves
    assert movie_3 in hazel.saves


def test_user_saves_array_creates_many_to_many(test_client, init_db):
    monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
        create_users_movies_and_tags()
    )
    # include movie that is recommended by user
    monkey.saves.append(movie_1)
    monkey.saves.append(movie_2)
    bella.saves.append(movie_2)
    bella.saves.append(movie_3)
    hazel.saves.append(movie_3)
    hazel.saves.append(movie_1)
    db.session.commit()
    # check movie.savers array
    assert monkey in movie_1.savers
    assert hazel in movie_1.savers
    assert monkey in movie_2.savers
    assert bella in movie_2.savers
    assert bella in movie_3.savers
    assert hazel in movie_3.savers

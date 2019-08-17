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
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(basedir, "test_api.db")
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
    monkey = User(name="monkey", email="monkey@cat.com")
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


""" Test Catch All Route """


def test_main_page(test_client, init_db):
    res = test_client.get("/random/route")
    assert res.status_code == 200


""" Test Auth """


def test_verify_password(test_client, init_db):
    monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
        create_users_movies_and_tags()
    )
    assert verify_password("monkey", "monkeypassword") == True
    assert verify_password("bella", "bellapassword") == True
    assert verify_password("monkey", "bellapassword") == False
    assert verify_password("bella", "monkeypassword") == False


def test_verify_token(test_client, init_db):
    # only checks that token exists, not that it belongs to user
    # test_check_token will verify that token returns correct user
    monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
        create_users_movies_and_tags()
    )
    assert verify_token(monkey.token) == True
    assert verify_token(bella.token) == True
    assert verify_token(hazel.token) == True
    assert verify_token(base64.b64encode(os.urandom(24)).decode("utf-8")) == False
    assert verify_token(base64.b64encode(os.urandom(24)).decode("utf-8")) == False
    assert verify_token(base64.b64encode(os.urandom(24)).decode("utf-8")) == False


""" Test API Routes"""


def test_get_user(test_client, init_db):
    monkey = create_users_movies_and_tags()[0]
    j_data = json.dumps({"token": monkey.token})
    res = test_client.post("/api/getuser", data=j_data, content_type="application/json")
    assert res.status_code == 200
    assert res.json["user"]["name"] == "monkey"
    assert res.json["user"]["email"] == "monkey@cat.com"


def test_get_user_no_email(test_client, init_db):
    monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
        create_users_movies_and_tags()
    )
    j_data = json.dumps({"token": bella.token})
    res = test_client.post("/api/getuser", data=j_data, content_type="application/json")
    assert res.status_code == 200
    assert res.json["user"]["name"] == "bella"
    assert res.json["user"]["email"] == None


def test_get_no_user(test_client, init_db):
    j_data = json.dumps({"token": "nonworkingtoken"})
    res = test_client.post("/api/getuser", data=j_data, content_type="application/json")
    assert res.status_code == 200
    assert res.json["user"]["name"] == None
    assert res.json["user"]["email"] == None


def test_get_user_movies(test_client, init_db):
    monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
        create_users_movies_and_tags()
    )
    monkey.saves.append(movie_2)
    bella.saves.append(movie_3)
    hazel.saves.append(movie_1)
    db.session.commit()

    j_data = json.dumps({"token": monkey.token})
    res = test_client.post(
        "/api/getmovies", data=j_data, content_type="application/json"
    )
    assert res.status_code == 200
    for movie in res.json["movies"]:
        if movie["slug"] == "movie_2":
            assert movie["saved"] == True
        else:
            assert movie["saved"] == False


def test_get_no_user_movies(test_client, init_db):
    monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
        create_users_movies_and_tags()
    )
    monkey.saves.append(movie_2)
    bella.saves.append(movie_3)
    hazel.saves.append(movie_1)
    db.session.commit()

    j_data = json.dumps({"token": None})
    res = test_client.post(
        "/api/getmovies", data=j_data, content_type="application/json"
    )
    assert res.status_code == 200
    for movie in res.json["movies"]:
        assert movie["saved"] == False


def test_add_user(test_client, init_db):
    monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
        create_users_movies_and_tags()
    )
    assert "laura" not in [u.name for u in User.query.all()]

    j_data = json.dumps({"name": "laura", "password": "laurapassword", "email": ""})
    res = test_client.post("/api/adduser", data=j_data, content_type="application/json")
    assert "laura" in [u.name for u in User.query.all()]


def test_sign_in(test_client, init_db):
    monkey = create_users_movies_and_tags()[0]
    headers = {"Authorization": "Basic bW9ua2V5Om1vbmtleXBhc3N3b3Jk"}
    res = test_client.post("/api/signin", headers=headers)
    assert res.status_code == 200
    assert res.json["token"] != None


# test_reset_password


def test_update_account(test_client, init_db):
    monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
        create_users_movies_and_tags()
    )

    # 1. change just monkey username
    headers = {"Authorization": "Bearer " + monkey.token}
    j_data = json.dumps({"newName": "monkeycat", "newEmail": None, "newPassword": None})
    res = test_client.post(
        "/api/updateaccount",
        headers=headers,
        data=j_data,
        content_type="application/json",
    )
    assert res.status_code == 200
    assert monkey.name == "monkeycat"
    assert monkey.email == "monkey@cat.com"
    assert monkey.check_password("monkeypassword") == True

    # 2.change bella username and email
    headers = {"Authorization": "Bearer " + bella.token}
    j_data = json.dumps(
        {"newName": "belladog", "newEmail": "bella@dog.com", "newPassword": None}
    )
    res = test_client.post(
        "/api/updateaccount",
        headers=headers,
        data=j_data,
        content_type="application/json",
    )
    assert res.status_code == 200
    assert bella.name == "belladog"
    assert bella.email == "bella@dog.com"
    assert bella.check_password("bellapassword") == True

    # 3.change hazel username, email, and password
    headers = {"Authorization": "Bearer " + hazel.token}
    j_data = json.dumps(
        {
            "newName": "hazeldog",
            "newEmail": "hazel@dog.com",
            "newPassword": "hazelnewpassword",
        }
    )
    res = test_client.post(
        "/api/updateaccount",
        headers=headers,
        data=j_data,
        content_type="application/json",
    )
    assert res.status_code == 200
    assert hazel.name == "hazeldog"
    assert hazel.email == "hazel@dog.com"
    assert hazel.check_password("hazelnewpassword") == True

    # 4. submit to hazel again, but w no changes
    headers = {"Authorization": "Bearer " + hazel.token}
    j_data = json.dumps({"newName": None, "newEmail": None, "newPassword": None})
    res = test_client.post(
        "/api/updateaccount",
        headers=headers,
        data=j_data,
        content_type="application/json",
    )
    assert res.status_code == 200
    assert hazel.name == "hazeldog"
    assert hazel.email == "hazel@dog.com"
    assert hazel.check_password("hazelnewpassword") == True


def test_delete_account(test_client, init_db):
    monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
        create_users_movies_and_tags()
    )
    headers = {"Authorization": "Basic bW9ua2V5Om1vbmtleXBhc3N3b3Jk"}
    res = test_client.delete("/api/deleteaccount", headers=headers)
    assert res.status_code == 200
    assert len(Movie.query.all()) == 2
    assert movie_2 in Movie.query.all()
    assert movie_3 in Movie.query.all()
    assert len(User.query.all()) == 2
    assert bella in User.query.all()
    assert hazel in User.query.all()


def test_save_movies(test_client, init_db):
    monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
        create_users_movies_and_tags()
    )
    headers = {"Authorization": "Bearer " + monkey.token}
    j_data = json.dumps({"slug": "movie_1"})
    res = test_client.post(
        "/api/savemovie", headers=headers, data=j_data, content_type="application/json"
    )
    assert monkey in movie_1.savers
    assert movie_1 in monkey.saves
    assert monkey not in movie_2.savers
    assert movie_2 not in monkey.saves
    assert len(movie_1.savers) == 1
    assert len(movie_2.savers) == 0
    assert len(movie_3.savers) == 0
    headers = {"Authorization": "Bearer " + bella.token}
    j_data = json.dumps({"slug": "movie_1"})
    res = test_client.post(
        "/api/savemovie", headers=headers, data=j_data, content_type="application/json"
    )
    headers = {"Authorization": "Bearer " + bella.token}
    j_data = json.dumps({"slug": "movie_2"})
    res = test_client.post(
        "/api/savemovie", headers=headers, data=j_data, content_type="application/json"
    )
    assert monkey in movie_1.savers and bella in movie_1.savers
    assert movie_1 in monkey.saves
    assert movie_1 in bella.saves
    assert bella in movie_2.savers
    assert movie_2 in bella.saves
    assert len(movie_1.savers) == 2
    assert len(movie_2.savers) == 1
    assert len(movie_3.savers) == 0


def test_unsave_movies(test_client, init_db):
    monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
        create_users_movies_and_tags()
    )
    movie_1.savers.append(monkey)
    movie_1.savers.append(bella)
    movie_2.savers.append(bella)
    movie_2.savers.append(hazel)
    movie_3.savers.append(hazel)
    movie_3.savers.append(monkey)
    db.session.commit()
    # remove movie_1 from monkey.saves
    assert movie_1 in monkey.saves
    headers = {"Authorization": "Bearer " + monkey.token}
    j_data = json.dumps({"slug": "movie_1"})
    res = test_client.post(
        "/api/unsavemovie",
        headers=headers,
        data=j_data,
        content_type="application/json",
    )
    assert movie_1 not in monkey.saves
    # remove movie_3 from monkey.saves
    assert movie_3 in monkey.saves
    headers = {"Authorization": "Bearer " + monkey.token}
    j_data = json.dumps({"slug": "movie_3"})
    res = test_client.post(
        "/api/unsavemovie",
        headers=headers,
        data=j_data,
        content_type="application/json",
    )
    assert movie_3 not in monkey.saves
    # remove movie_1 from bella.saves
    assert movie_1 in bella.saves
    headers = {"Authorization": "Bearer " + bella.token}
    j_data = json.dumps({"slug": "movie_1"})
    res = test_client.post(
        "/api/unsavemovie",
        headers=headers,
        data=j_data,
        content_type="application/json",
    )
    assert movie_1 not in bella.saves
    assert len(movie_1.savers) == 0
    assert len(movie_2.savers) == 2
    assert len(movie_3.savers) == 1


def test_suggest_movie(test_client, init_db):
    monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
        create_users_movies_and_tags()
    )
    # add movie_4 w recommender_id = 3 (hazel)
    assert len(hazel.recommendations) == 1
    headers = {"Authorization": "Bearer " + hazel.token}
    j_data = json.dumps({"title": "Movie 4", "year": "2019"})
    res = test_client.post(
        "/api/suggestmovie",
        headers=headers,
        data=j_data,
        content_type="application/json",
    )
    movie_4 = Movie.query.filter_by(title="Movie 4").first()
    assert movie_4 in hazel.recommendations
    assert len(hazel.recommendations) == 2


def test_unsuggest_movie(test_client, init_db):
    monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
        create_users_movies_and_tags()
    )
    # remove movie_2 recommended by bella
    assert len(bella.recommendations) == 1
    headers = {"Authorization": "Bearer " + bella.token}
    j_data = json.dumps({"slug": "movie_2"})
    res = test_client.post(
        "/api/removesuggestion",
        headers=headers,
        data=j_data,
        content_type="application/json",
    )
    assert res.status_code == 200
    assert len(bella.recommendations) == 0
    # try to remove movie not recommended by person
    headers = {"Authorization": "Bearer " + bella.token}
    j_data = json.dumps({"slug": "movie_3"})
    res = test_client.post(
        "/api/removesuggestion",
        headers=headers,
        data=j_data,
        content_type="application/json",
    )
    assert res.status_code == 401

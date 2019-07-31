import os
import sys
sys.path.append(os.path.abspath("../../"))
import unittest
from app import create_app, db
from app.models import Movie, Tag, User
from config import Config
from app.api.auth import verify_password, verify_token
import base64
import json
import csv_loader


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite://"
    ELASTICSEARCH_URL = None


class BackendTests(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestConfig)
        self.app_context = self.app.app_context()
        self.app_context.push()
        self.client = self.app.test_client()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def create_users_movies_and_tags(self):
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
        movie_1 = Movie(
            uniquename="movie_1",
            name="Movie 1",
            year=2019,
            recommender_id=1,
        )
        movie_2 = Movie(
            uniquename="movie_2",
            name="Movie 2",
            year=2019,
            recommender_id=2,
        )
        movie_3 = Movie(
            uniquename="movie_3",
            name="Movie 3",
            year=2019,
            recommender_id=3,
        )
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

    def test_movie_recommender_id_property_creates_one_to_many(self):
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
            self.create_users_movies_and_tags()
        )
        # check user.recommendations array contains whole movie object
        self.assertTrue(movie_1 in monkey.recommendations)
        # full circle, check movie.recommended_by contains whole user object
        self.assertTrue(movie_1.recommended_by == monkey)

    # Movie Tags Many-to-Many

    def test_movie_tags_array_creates_many_to_many(self):
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
            self.create_users_movies_and_tags()
        )
        movie_1.tags.append(action)
        movie_1.tags.append(comedy)
        movie_2.tags.append(comedy)
        movie_2.tags.append(documentary)
        movie_3.tags.append(documentary)
        movie_3.tags.append(action)
        db.session.commit()
        # check the tag.movies array
        self.assertTrue(movie_1 in action.movies)
        self.assertTrue(movie_1 in comedy.movies)
        self.assertTrue(movie_2 in comedy.movies)
        self.assertTrue(movie_2 in documentary.movies)
        self.assertTrue(movie_3 in documentary.movies)
        self.assertTrue(movie_3 in action.movies)

    def test_tag_movies_array_creates_many_to_many(self):
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
            self.create_users_movies_and_tags()
        )
        action.movies.append(movie_1)
        action.movies.append(movie_2)
        comedy.movies.append(movie_2)
        comedy.movies.append(movie_3)
        documentary.movies.append(movie_3)
        documentary.movies.append(movie_1)
        db.session.commit()
        # check movie.tags array
        self.assertTrue(action in movie_1.tags)
        self.assertTrue(documentary in movie_1.tags)
        self.assertTrue(action in movie_2.tags)
        self.assertTrue(comedy in movie_2.tags)
        self.assertTrue(comedy in movie_3.tags)
        self.assertTrue(documentary in movie_3.tags)

    # Saved Movies Many-to-Many

    def test_movie_savers_array_creates_many_to_many(self):
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
            self.create_users_movies_and_tags()
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
        self.assertTrue(movie_1 in monkey.saves)
        self.assertTrue(movie_3 in monkey.saves)
        self.assertTrue(movie_1 in bella.saves)
        self.assertTrue(movie_2 in bella.saves)
        self.assertTrue(movie_2 in hazel.saves)
        self.assertTrue(movie_3 in hazel.saves)

    def test_user_saves_array_creates_many_to_many(self):
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
            self.create_users_movies_and_tags()
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
        self.assertTrue(monkey in movie_1.savers)
        self.assertTrue(hazel in movie_1.savers)
        self.assertTrue(monkey in movie_2.savers)
        self.assertTrue(bella in movie_2.savers)
        self.assertTrue(bella in movie_3.savers)
        self.assertTrue(hazel in movie_3.savers)

    """ Test csv_loader"""

    def test_csv_loader(self):
        user_1 = User(username="user_1")
        user_1.set_password("user1password")
        db.session.add(user_1)
        db.session.commit()
        csv_loader.load_movies("../../movies.csv")
        self.assertTrue(len(user_1.recommendations) == 95)
        for m in Movie.query.all():
            self.assertTrue(m.recommended_by == user_1)

    """ Test Catch All Route """

    def test_main_page(self):
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)

    """ Test Auth """

    def test_verify_password(self):
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
            self.create_users_movies_and_tags()
        )
        self.assertTrue(verify_password("monkey", "monkeypassword"))
        self.assertTrue(verify_password("bella", "bellapassword"))
        self.assertFalse(verify_password("monkey", "bellapassword"))
        self.assertFalse(verify_password("bella", "monkeypassword"))

    def test_verify_token(self):
        # only checks that token exists, not that it belongs to user
        # test_check_token will verify that token returns correct user
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
            self.create_users_movies_and_tags()
        )
        self.assertTrue(verify_token(monkey.token))
        self.assertTrue(verify_token(bella.token))
        self.assertTrue(verify_token(hazel.token))
        self.assertFalse(verify_token(base64.b64encode(os.urandom(24)).decode("utf-8")))
        self.assertFalse(verify_token(base64.b64encode(os.urandom(24)).decode("utf-8")))
        self.assertFalse(verify_token(base64.b64encode(os.urandom(24)).decode("utf-8")))

    """ Test API Routes"""

    def test_check_token(self):
        monkey = self.create_users_movies_and_tags()[0]
        headers = {"Authorization": "Bearer " + monkey.token}
        res = self.client.post("/api/checktoken", headers=headers)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json["user"], "monkey")
        self.assertEqual(res.json["email"], None)

    def test_get_movies_no_user(self):
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
            self.create_users_movies_and_tags()
        )
        monkey.saves.append(movie_2)
        bella.saves.append(movie_3)
        hazel.saves.append(movie_1)
        db.session.commit()
        j_data = json.dumps({"user": ""})
        res = self.client.post(
            "/api/get_movies", data=j_data, content_type="application/json"
        )
        self.assertEqual(res.status_code, 200)
        for movie in res.json["movies"]:
            self.assertTrue(movie["saved"] == False)

    def test_get_movies_user(self):
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
            self.create_users_movies_and_tags()
        )
        monkey.saves.append(movie_2)
        bella.saves.append(movie_3)
        hazel.saves.append(movie_1)
        db.session.commit()
        j_data = json.dumps({"user": monkey.username})
        res = self.client.post(
            "/api/get_movies", data=j_data, content_type="application/json"
        )
        self.assertEqual(res.status_code, 200)
        for movie in res.json["movies"]:
            if movie["slug"] == "movie_2":
                self.assertTrue(movie["saved"] == True)
            else:
                self.assertTrue(movie["saved"] == False)

    def test_add_user(self):
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
            self.create_users_movies_and_tags()
        )
        self.assertFalse("laura" in [u.username for u in User.query.all()])
        j_data = json.dumps(
            {"userName": "laura", "password": "laurapassword", "email": ""}
        )
        res = self.client.post(
            "/api/adduser", data=j_data, content_type="application/json"
        )
        self.assertTrue("laura" in [u.username for u in User.query.all()])

    def test_sign_in(self):
        monkey = self.create_users_movies_and_tags()[0]
        headers = {"Authorization": "Basic bW9ua2V5Om1vbmtleXBhc3N3b3Jk"}
        res = self.client.post("/api/signin", headers=headers)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json["user"], "monkey")
        self.assertTrue(res.json["token"] != None)

    # test_reset_password

    def test_update_account(self):
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
            self.create_users_movies_and_tags()
        )

        # 1. change just monkey username
        headers = {"Authorization": "Bearer " + monkey.token}
        j_data = json.dumps(
            {"newUserName": "monkeycat", "newEmail": None, "newPassword": None}
        )
        res = self.client.post(
            "/api/updateaccount",
            headers=headers,
            data=j_data,
            content_type="application/json",
        )
        self.assertEqual(res.status_code, 200)
        # username should have changed
        self.assertEqual(monkey.username, "monkeycat")
        self.assertEqual(res.json["user"], "monkeycat")
        # email is same
        self.assertEqual(monkey.email, None)
        self.assertEqual(res.json["email"], None)
        # password is same
        self.assertTrue(monkey.check_password("monkeypassword"))

        # 2.change bella username and email
        headers = {"Authorization": "Bearer " + bella.token}
        j_data = json.dumps(
            {
                "newUserName": "belladog",
                "newEmail": "bella@dog.com",
                "newPassword": None,
            }
        )
        res = self.client.post(
            "/api/updateaccount",
            headers=headers,
            data=j_data,
            content_type="application/json",
        )
        self.assertEqual(res.status_code, 200)
        # username should have changed
        self.assertEqual(bella.username, "belladog")
        self.assertEqual(res.json["user"], "belladog")
        # email should have changed
        self.assertEqual(bella.email, "bella@dog.com")
        self.assertEqual(res.json["email"], "bella@dog.com")
        # password is same
        self.assertTrue(bella.check_password("bellapassword"))

        # 3.change hazel username, email, and password
        headers = {"Authorization": "Bearer " + hazel.token}
        j_data = json.dumps(
            {
                "newUserName": "hazeldog",
                "newEmail": "hazel@dog.com",
                "newPassword": "hazelnewpassword",
            }
        )
        res = self.client.post(
            "/api/updateaccount",
            headers=headers,
            data=j_data,
            content_type="application/json",
        )
        self.assertEqual(res.status_code, 200)
        # username should have changed
        self.assertEqual(hazel.username, "hazeldog")
        self.assertEqual(res.json["user"], "hazeldog")
        # email should have changed
        self.assertEqual(hazel.email, "hazel@dog.com")
        self.assertEqual(res.json["email"], "hazel@dog.com")
        # password should have changed
        self.assertTrue(hazel.check_password("hazelnewpassword"))

        # 4. submit to hazel again, but w no changes
        headers = {"Authorization": "Bearer " + hazel.token}
        j_data = json.dumps(
            {"newUserName": None, "newEmail": None, "newPassword": None}
        )
        res = self.client.post(
            "/api/updateaccount",
            headers=headers,
            data=j_data,
            content_type="application/json",
        )
        self.assertEqual(res.status_code, 200)
        # username should be same
        self.assertEqual(hazel.username, "hazeldog")
        self.assertEqual(res.json["user"], "hazeldog")
        # email should be same
        self.assertEqual(hazel.email, "hazel@dog.com")
        self.assertEqual(res.json["email"], "hazel@dog.com")
        # password should be same
        self.assertTrue(hazel.check_password("hazelnewpassword"))

    def test_delete_account(self):
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
            self.create_users_movies_and_tags()
        )
        headers = {"Authorization": "Basic bW9ua2V5Om1vbmtleXBhc3N3b3Jk"}
        res = self.client.delete("/api/deleteaccount", headers=headers)
        self.assertEqual(res.status_code, 200)
        self.assertTrue(len(Movie.query.all()) == 2)
        self.assertTrue(movie_2 in Movie.query.all())
        self.assertTrue(movie_3 in Movie.query.all())
        self.assertTrue(len(User.query.all()) == 2)
        self.assertTrue(bella in User.query.all())
        self.assertTrue(hazel in User.query.all())

    def test_save_movie(self):
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
            self.create_users_movies_and_tags()
        )
        headers = {"Authorization": "Bearer " + monkey.token}
        j_data = json.dumps({"slug": "movie_1"})
        res = self.client.post(
            "/api/savemovie",
            headers=headers,
            data=j_data,
            content_type="application/json",
        )
        self.assertTrue(monkey in movie_1.savers)
        self.assertTrue(movie_1 in monkey.saves)
        self.assertFalse(monkey in movie_2.savers)
        self.assertFalse(movie_2 in monkey.saves)
        self.assertTrue(len(movie_1.savers) == 1)
        self.assertTrue(len(movie_2.savers) == 0)
        self.assertTrue(len(movie_3.savers) == 0)
        headers = {"Authorization": "Bearer " + bella.token}
        j_data = json.dumps({"slug": "movie_1"})
        res = self.client.post(
            "/api/savemovie",
            headers=headers,
            data=j_data,
            content_type="application/json",
        )
        headers = {"Authorization": "Bearer " + bella.token}
        j_data = json.dumps({"slug": "movie_2"})
        res = self.client.post(
            "/api/savemovie",
            headers=headers,
            data=j_data,
            content_type="application/json",
        )
        self.assertTrue(monkey in movie_1.savers and bella in movie_1.savers)
        self.assertTrue(movie_1 in monkey.saves)
        self.assertTrue(movie_1 in bella.saves)
        self.assertTrue(bella in movie_2.savers)
        self.assertTrue(movie_2 in bella.saves)
        self.assertTrue(len(movie_1.savers) == 2)
        self.assertTrue(len(movie_2.savers) == 1)
        self.assertTrue(len(movie_3.savers) == 0)

    def test_unsave_movie(self):
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
            self.create_users_movies_and_tags()
        )
        movie_1.savers.append(monkey)
        movie_1.savers.append(bella)
        movie_2.savers.append(bella)
        movie_2.savers.append(hazel)
        movie_3.savers.append(hazel)
        movie_3.savers.append(monkey)
        db.session.commit()
        # remove movie_1 from monkey.saves
        self.assertTrue(movie_1 in monkey.saves)
        headers = {"Authorization": "Bearer " + monkey.token}
        j_data = json.dumps({"slug": "movie_1"})
        res = self.client.post(
            "/api/unsavemovie",
            headers=headers,
            data=j_data,
            content_type="application/json",
        )
        self.assertFalse(movie_1 in monkey.saves)
        # remove movie_3 from monkey.saves
        self.assertTrue(movie_3 in monkey.saves)
        headers = {"Authorization": "Bearer " + monkey.token}
        j_data = json.dumps({"slug": "movie_3"})
        res = self.client.post(
            "/api/unsavemovie",
            headers=headers,
            data=j_data,
            content_type="application/json",
        )
        self.assertFalse(movie_3 in monkey.saves)
        # remove movie_1 from bella.saves
        self.assertTrue(movie_1 in bella.saves)
        headers = {"Authorization": "Bearer " + bella.token}
        j_data = json.dumps({"slug": "movie_1"})
        res = self.client.post(
            "/api/unsavemovie",
            headers=headers,
            data=j_data,
            content_type="application/json",
        )
        self.assertFalse(movie_1 in bella.saves)
        self.assertTrue(len(movie_1.savers) == 0)
        self.assertTrue(len(movie_2.savers) == 2)
        self.assertTrue(len(movie_3.savers) == 1)

    def test_suggest_movie(self):
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
            self.create_users_movies_and_tags()
        )
        # add movie_4 w recommender_id = 3 (hazel)
        self.assertTrue(len(hazel.recommendations) == 1)
        headers = {"Authorization": "Bearer " + hazel.token}
        j_data = json.dumps({"title": "Movie 4", "year": "2019"})
        res = self.client.post(
            "/api/suggestmovie",
            headers=headers,
            data=j_data,
            content_type="application/json",
        )
        movie_4 = Movie.query.filter_by(name="Movie 4").first()
        self.assertTrue(movie_4 in hazel.recommendations)
        self.assertTrue(len(hazel.recommendations) == 2)

    def test_unsuggest_movie(self):
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = (
            self.create_users_movies_and_tags()
        )
        # remove movie_2 recommended by bella
        self.assertTrue(len(bella.recommendations) == 1)
        headers = {"Authorization": "Bearer " + bella.token}
        j_data = json.dumps({"slug": "movie_2"})
        res = self.client.post(
            "/api/removesuggestion",
            headers=headers,
            data=j_data,
            content_type="application/json",
        )
        self.assertEqual(res.status_code, 200)
        self.assertTrue(len(bella.recommendations) == 0)
        # try to remove movie not recommended by person
        headers = {"Authorization": "Bearer " + bella.token}
        j_data = json.dumps({"slug": "movie_3"})
        res = self.client.post(
            "/api/removesuggestion",
            headers=headers,
            data=j_data,
            content_type="application/json",
        )
        self.assertEqual(res.status_code, 401)


if __name__ == "__main__":
    unittest.main(verbosity=2)

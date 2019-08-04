import unittest
from urllib.request import urlopen

from flask_testing import LiveServerTestCase
from selenium import webdriver

import os
import sys
import time
import csv

sys.path.append(os.path.abspath("../../"))
basedir = os.path.abspath(os.path.dirname(__file__))

from app import create_app, db
from app.models import Movie, Tag, User
from config import Config
from data_loader.csv_loader import *


"""
Must create a React build to run these tests
"""


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL"
    ) or "sqlite:///" + os.path.join(basedir, "endtoend_test.db")
    ELASTICSEARCH_URL = None
    LIVESERVER_PORT = 8943


class EndToEndTest(LiveServerTestCase):
    def create_app(self):
        app = create_app(TestConfig)
        return app

    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.get(self.get_server_url())

        db.session.commit()
        db.drop_all()
        db.create_all()

    def tearDown(self):
        self.driver.quit()

    """ Test CSV Loader """

    def test_csv_loader(self):

        # assertTrue 0 users and 0 movies (backend)
        self.assertTrue(len(User.query.all()) == 0)
        self.assertTrue(len(Movie.query.all()) == 0)

        # add user 1 and 96 movies including comingsoon (backend)
        crg253 = User(username="crg253")
        crg253.set_password("crg253password")
        db.session.add(crg253)
        comingsoon = Movie(
            uniquename="comingsoon",
            name="Coming Soon",
            year=2019,
            video_link="https://www.youtube.com/embed/RODwmMxLKa0",
            recommender_id=1,
        )
        db.session.add(comingsoon)
        db.session.commit()
        load_movies("../../data_loader/movies.csv")
        time.sleep(5)

        # assertTrue 1 user and 96 movies exist in db (backend)
        self.assertTrue(len(User.query.all()) == 1)
        self.assertTrue(len(Movie.query.all()) == 96)

        # visually verify movies on website(frontend)
        driver = self.driver
        driver.get(self.get_server_url() + "/all/comingsoon")
        time.sleep(2)

        # assertTrue every title is shown on website (frontend)
        displayed_movie_list = driver.find_element_by_id("movie-list-wrapper").text
        with open("../../data_loader/movies.csv") as movies:
            for movie in csv.reader(movies):
                self.assertTrue(movie[0] in displayed_movie_list)

        # enzyme test sort buttons
        # user not signed in ... should see 0 saved and suggested movies

    """ Test Forms """

    def test_add_user(self):
        driver = self.driver

        # sampleuser123 should NOT exist
        self.assertTrue(User.query.filter_by(username="sampleuser123").first() == None)

        # create sampleuser123 via frontend
        driver.get(self.get_server_url() + "/createaccount")
        elem1 = driver.find_element_by_id("create-account-username-input")
        elem1.send_keys("sampleuser123")
        elem2 = driver.find_element_by_id("create-account-password-input")
        elem2.send_keys("password")
        elem3 = driver.find_element_by_id("create-account-submit-button")
        elem3.click()
        # expect to see modal response

        # wait
        time.sleep(2)
        # sampleuser123 SHOULD exist in db (backend)
        self.assertFalse(User.query.filter_by(username="sampleuser123").first() == None)

    def test_sign_in(self):
        # should see change in user movies on sign in
        pass

    def test_reset_password(self):
        pass

    def test_update_account(self):
        pass

    def test_delete_account(self):
        pass

    """ Test Button Redirects """
    # Test Save Unsave Redirects

    def test_save_redirect_from_trailer_page(self):
        pass

    def test_unsave_redirect_from_trailer_page(self):
        # simulate token expiration
        pass

    def test_save_redirect_from_user_suggestions(self):
        pass

    def test_unsave_redirect_from_user_suggestions(self):
        # simulate token expiration
        pass

    def test_unsave_redirect_from_user_movies(self):
        # simulate token expiration
        pass

    # Test Recommend Unrecommend Redirects

    def test_recommend_movie_redirect(self):
        pass

    def test_unrecommend_movie_redirect(self):
        # simulate token expiration
        pass

    """ Test Buttons """

    def test_save_from_trailer_page(self):
        pass

    def test_unsave_from_trailer_page(self):
        pass

    def test_save_from_user_suggestions(self):
        pass

    def test_unsave_from_user_suggestions(self):
        pass

    def test_unsave_from_user_movies(self):
        pass

    def test_recommend_movie(self):
        pass

    def test_unrecommend_movie(self):
        pass

    """ Test Complex User Flow """

    def test_user_flow_1(self):
        """
        load csv
        add user, sign in, save, unsave, recommend, unrecommend, reset, update, delete
        """
        pass


if __name__ == "__main__":
    unittest.main()

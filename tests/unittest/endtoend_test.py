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

    def test_1_add_user_1_and_96_movies(self):

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

        # NEED TO TEST THAT ORDER IS CORRECT BY SORT BUTTON

    # def test_2_create_user(self):
    #     driver = self.driver
    #
    #     # sampleuser123 should NOT exist
    #     self.assertTrue(User.query.filter_by(username="sampleuser123").first() == None)
    #
    #     # create sampleuser123
    #     driver.get(self.get_server_url() + "/createaccount")
    #     elem1 = driver.find_element_by_id("create-account-username-input")
    #     elem1.send_keys("sampleuser123")
    #     elem2 = driver.find_element_by_id("create-account-password-input")
    #     elem2.send_keys("password")
    #     elem3 = driver.find_element_by_id("create-account-submit-button")
    #     elem3.click()
    #     # expect to see modal response
    #
    #     # wait
    #     time.sleep(2)
    #     # sampleuser123 SHOULD exist
    #     self.assertFalse(User.query.filter_by(username="sampleuser123").first() == None)


if __name__ == "__main__":
    unittest.main()

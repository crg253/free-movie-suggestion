import unittest
from urllib.request import urlopen

from flask_testing import LiveServerTestCase
from selenium import webdriver

import os
import sys
import time

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


    def tearDown(self):
        self.driver.quit()

    # def test_server_is_working(self):
    #     response = urlopen(self.get_server_url())

    def test_view_movies(self):
        driver = self.driver
        driver.get(self.get_server_url() + "/all/comingsoon")
        time.sleep(5)

    def test_create_user(self):
        driver = self.driver

        self.assertTrue(User.query.filter_by(username="sampleuser123").first() == None)

        # create user
        driver.get(self.get_server_url() + "/createaccount")
        elem1 = driver.find_element_by_id("create-account-username-input")
        elem1.send_keys("sampleuser123")
        elem2 = driver.find_element_by_id("create-account-password-input")
        elem2.send_keys("password")
        elem3 = driver.find_element_by_id("create-account-submit-button")
        elem3.click()
        # expect modal
        time.sleep(5)
        self.assertFalse(User.query.filter_by(username="sampleuser123").first() == None)


if __name__ == "__main__":
    unittest.main()

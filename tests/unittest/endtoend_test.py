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

    def test_add_user_1_and_96_movies(self):

        """ add user 1 and 96 movies including comingsoon (via backend) """
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

        """ expect 1 user and 96 movies exist in db (backend) """
        self.assertTrue(len(User.query.all()) == 1)
        self.assertTrue(len(Movie.query.all()) == 96)

        """ visually verify movies on website (frontend) """
        driver = self.driver
        driver.get(self.get_server_url() + "/all/comingsoon")
        time.sleep(2)

        """ expect to see every title on website (frontend) """
        displayed_movie_list = driver.find_element_by_id("movie-list-wrapper").text
        with open("../../data_loader/movies.csv") as movies:
            for movie in csv.reader(movies):
                self.assertTrue(movie[0] in displayed_movie_list)

    def test_sort(self):
        pass

    def test_arrows(self):
        pass

    def test_create_user(self):

        """ create user (via frontend) """
        driver = self.driver
        driver.get(self.get_server_url() + "/createaccount")
        name_input = driver.find_element_by_id("create-account-username-input")
        name_input.send_keys("sampleuser123")
        pass_input = driver.find_element_by_id("create-account-password-input")
        pass_input.send_keys("password")
        time.sleep(1)
        submit_button = driver.find_element_by_id("create-account-submit-button")
        submit_button.click()
        time.sleep(2)

        """ expect to see modal response """
        displayed_modal = driver.find_element_by_id("create-account-message-modal").text
        self.assertTrue("Thank you for creating account." in displayed_modal)

        """ sampleuser123 SHOULD exist in db (backend) """
        self.assertFalse(User.query.filter_by(username="sampleuser123").first() == None)

    def test_sign_in_user(self):

        """ create user """
        sampleuser123 = User(username='sampleuser123')
        sampleuser123.set_password('password')
        db.session.add(sampleuser123)
        db.session.commit()

        """ sign in user (via frontend) """
        driver = self.driver
        driver.get(self.get_server_url()+ "/signin")
        name_input = driver.find_element_by_id("signin-username-input")
        name_input.send_keys("sampleuser123")
        pass_input = driver.find_element_by_id("signin-password-input")
        pass_input.send_keys("password")
        time.sleep(1)
        submit_button = driver.find_element_by_id("signin-submit-button")
        submit_button.click()
        time.sleep(2)

        """ expect to see modal """
        displayed_modal = driver.find_element_by_id("signin-message-modal").text
        self.assertTrue("Now signed in as sampleuser123." in displayed_modal)

        """ expect to see a token in localStorage """

    def test_save_unsave_movies(self):

        """ add user 1 and 96 movies including comingsoon (via backend) """
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

        """ create user """
        sampleuser123 = User(username='sampleuser123')
        sampleuser123.set_password('password')
        db.session.add(sampleuser123)
        db.session.commit()
        time.sleep(5)

        """ sign in """
        driver = self.driver
        driver.get(self.get_server_url()+ "/signin")
        name_input = driver.find_element_by_id("signin-username-input")
        name_input.send_keys("sampleuser123")
        pass_input = driver.find_element_by_id("signin-password-input")
        pass_input.send_keys("password")
        time.sleep(1)
        submit_button = driver.find_element_by_id("signin-submit-button")
        submit_button.click()
        time.sleep(2)

        """ save three movies with trailer button """
        driver.get(self.get_server_url()+"/romance/aintthembodiessaints2013")
        time.sleep(2)
        save_button = driver.find_element_by_id("trailer-save-button")
        save_button.click()
        time.sleep(2)

        driver.get(self.get_server_url()+"/comedy/alltherealgirls2003")
        time.sleep(2)
        save_button = driver.find_element_by_id("trailer-save-button")
        save_button.click()
        time.sleep(2)

        driver.get(self.get_server_url()+"/documentary/americanexperiencetheislandmurder2018")
        time.sleep(2)
        save_button = driver.find_element_by_id("trailer-save-button")
        save_button.click()
        time.sleep(2)

        """ expect to see 3 movies saved in /usermovies """
        driver.get(self.get_server_url()+"/usermovies")
        time.sleep(2)
        displayed_movies = driver.find_element_by_id("saved-movies-wrapper").text
        self.assertTrue("Ain't Them Bodies Saints" in displayed_movies)
        self.assertTrue("All the Real Girls" in displayed_movies)
        self.assertTrue("American Experience: The Island Murder" in displayed_movies)

        """ expect to see 3 movies in sampleuser123.saves """

        """ unsave one movie with trailer button """
        driver.get(self.get_server_url()+"/romance/aintthembodiessaints2013")
        time.sleep(2)
        save_button = driver.find_element_by_id("trailer-unsave-button")
        save_button.click()
        time.sleep(2)

        """ expect to see 2 movies saved in /usermovies """
        driver.get(self.get_server_url()+"/usermovies")
        time.sleep(2)
        displayed_movies = driver.find_element_by_id("saved-movies-wrapper").text
        self.assertFalse("Ain't Them Bodies Saints" in displayed_movies)
        self.assertTrue("All the Real Girls" in displayed_movies)
        self.assertTrue("American Experience: The Island Murder" in displayed_movies)

        """ expect to see 2 movies in sampleuser123.saves """

        """ unsave movie with /usermovies unsave button """
        unsave_button = driver.find_element_by_id("user-movies-alltherealgirls2003-unsave-button")
        unsave_button.click()
        time.sleep(2)

        """ expect to see only one movie left """
        displayed_movies = driver.find_element_by_id("saved-movies-wrapper").text
        self.assertFalse("Ain't Them Bodies Saints" in displayed_movies)
        self.assertFalse("All the Real Girls" in displayed_movies)
        self.assertTrue("American Experience: The Island Murder" in displayed_movies)

        """ expect to see 1 movies in sampleuser123.saves """

    def test_suggest_unsuggest(self):

        """ create user """
        sampleuser123 = User(username='sampleuser123')
        sampleuser123.set_password('password')
        db.session.add(sampleuser123)
        db.session.commit()
        time.sleep(5)

        """ sign in """
        driver = self.driver
        driver.get(self.get_server_url()+ "/signin")
        name_input = driver.find_element_by_id("signin-username-input")
        name_input.send_keys("sampleuser123")
        pass_input = driver.find_element_by_id("signin-password-input")
        pass_input.send_keys("password")
        time.sleep(1)
        submit_button = driver.find_element_by_id("signin-submit-button")
        submit_button.click()
        time.sleep(2)

        """ suggest 3 movies """
        driver.get(self.get_server_url()+"/recommend")
        movie_search_input = driver.find_element_by_id("recommend-movie-title-search-input")
        movie_search_input.send_keys("Karate Kid")
        submit_button = driver.find_element_by_id("recommend-submit-search-button")
        submit_button.click()
        time.sleep(3)
        suggest_button = driver.find_element_by_id("recommend-search-result-add-button-0")
        suggest_button.click()
        time.sleep(3)

        """ expect to see modal """
        """ expect to see 3 movies in db """
        """ expect to see 3 cards at /usermovies """
        """ add video_link to two movies """
        """ expect to see 2 trailers and one card at /usermovies """


    def test_second_user_save_unsave_first_user_movies(self):
        pass
    def test_third_user_forgot_password(self):
        pass
    def test_edit_account(self):
        pass
    def test_delete_account(self):
        pass


if __name__ == "__main__":
    unittest.main()

import unittest
from urllib.request import urlopen

from flask_testing import LiveServerTestCase
from selenium import webdriver

import os
import sys
import time
import csv
import string

sys.path.append(os.path.abspath("../"))
basedir = os.path.abspath(os.path.dirname(__file__))

from app import create_app, db
from app.models import Movie, Tag, User
from config import Config
from data_loader.csv_loader import *


"""
Must create a React build to run these tests
"""


def for_sort_by_title(title):
    if title[0:4] == "The ":
        slug = title[4:]
    else:
        slug = title
    to_remove = [" ", "'", ",", "!", ".", ":", "&", "-"]
    for item in to_remove:
        slug = slug.replace(item, "")
    return slug


def for_sort_by_year(title):
    if title[4:8] == "The ":
        slug = title[0:4] + title[8:]
    else:
        slug = title
    to_remove = [" ", "'", ",", "!", ".", ":", "&", "-"]
    for item in to_remove:
        slug = slug.replace(item, "")
    return slug


def csv_titles_by_title(genre):
    """ Create a List of What Should Be Displayed  """
    genre_movies = []
    with open("../data_loader/movies.csv") as movies:
        # for each line of movies.csv
        for movie in csv.reader(movies):
            # if movie title is not one of these three, then proceed
            if movie[0] != "M" and movie[0] != "Cloverfield" and movie[0] != "Creep":
                # for each tag in line, if tag matches genre
                for tag in movie[3:]:
                    if tag == genre:
                        # go back to the title and add the title to genre_movies
                        genre_movies.append(movie[0])
                # if genre = "All", then get all titles
                if genre == "All":
                    genre_movies.append(movie[0])
    genre_movies.sort(key=for_sort_by_title)
    print(genre_movies)
    return genre_movies


def csv_titles_by_year(genre):
    """ Create a List of What Should Be Displayed  """
    genre_movies = []
    with open("../data_loader/movies.csv") as movies:
        # for each line of movies.csv
        for movie in csv.reader(movies):
            # if movie title is not one of these three, then proceed
            if movie[0] != "M" and movie[0] != "Cloverfield" and movie[0] != "Creep":
                # for each tag in line, if tag matches genre
                for tag in movie[3:]:
                    if tag == genre:
                        # go back to the title and add the title to genre_movies
                        genre_movies.append(movie[1] + movie[0])
                # if genre = "All", then get all titles
                if genre == "All":
                    genre_movies.append(movie[1] + movie[0])
    genre_movies.sort(key=for_sort_by_year)
    new_genre_movies = []
    for movie in genre_movies:
        new_genre_movies.append(movie[4:])
    print(new_genre_movies)
    return new_genre_movies


def displayed_text_as_list(displayed_data):
    """ Create List of What is Displayed """
    # make list of all movie titles
    all_titles = []
    with open("../data_loader/movies.csv") as movies:
        for movie in csv.reader(movies):
            if movie[0] != "M" and movie[0] != "Cloverfield" and movie[0] != "Creep":
                all_titles.append(movie[0])

    #  make dict of location of each title in data (if displayed)
    location = {}
    for title in all_titles:
        if displayed_data.find(title) != -1:
            location[displayed_data.find(title)] = title
    # sort keys and derive a list of titles from dict
    displayed = []
    for key in sorted(location.keys()):
        displayed.append(location[key])
    print(displayed)

    return displayed


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(basedir, "endtoend_test.db")
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

    def test_first_load_no_user(self):
        print("test_first_load_no_user")

        # add user 1 and 96 movies including comingsoon (via backend)
        crg253 = User(name="crg253")
        crg253.set_password("crg253password")
        db.session.add(crg253)
        comingsoon = Movie(
            slug="comingsoon",
            title="Coming Soon",
            year=2019,
            video_link="https://www.youtube.com/embed/RODwmMxLKa0",
            recommender_id=1,
        )
        db.session.add(comingsoon)
        db.session.commit()
        load_movies("../data_loader/movies.csv")
        time.sleep(5)

        # expect 1 user and 96 movies exist in db (backend)
        self.assertTrue(len(User.query.all()) == 1)
        self.assertTrue(len(Movie.query.all()) == 96)

        # visually verify movies on website (frontend)
        driver = self.driver
        driver.get(self.get_server_url() + "/all/comingsoon")
        time.sleep(3)

        """ Compare what should be listed with what is shown"""
        """ All """
        # sort All by title
        title_sort_button = driver.find_element_by_xpath(
            "//button[@data-test='title-sort-button']"
        )
        title_sort_button.click()
        time.sleep(3)
        should_list = csv_titles_by_title("All")
        displayed_list = displayed_text_as_list(
            driver.find_element_by_xpath("//div[@data-test='movie-list']").text
        )
        self.assertTrue(should_list == displayed_list)

        # sort All by year
        year_sort_button = driver.find_element_by_xpath(
            "//button[@data-test='year-sort-button']"
        )
        year_sort_button.click()
        time.sleep(3)
        should_list = csv_titles_by_year("All")
        displayed_list = displayed_text_as_list(
            driver.find_element_by_xpath("//div[@data-test='movie-list']").text
        )
        self.assertTrue(should_list == displayed_list)

        """ TEST UP ARROW """
        # arrow up to Action
        arrow_up = driver.find_element_by_xpath(
            "//button[@data-test='genres-forward-button']"
        )
        arrow_up.click()
        time.sleep(1)
        selected_genre = driver.find_element_by_xpath(
            "//h2[@data-test='selected-genre']"
        ).text
        self.assertTrue("Action" in selected_genre)

        # sort Action by title
        title_sort_button = driver.find_element_by_xpath(
            "//button[@data-test='title-sort-button']"
        )
        title_sort_button.click()
        time.sleep(3)
        should_list = csv_titles_by_title("Action")
        displayed_list = displayed_text_as_list(
            driver.find_element_by_xpath("//div[@data-test='movie-list']").text
        )
        self.assertTrue(should_list == displayed_list)

        # sort Action by year
        year_sort_button = driver.find_element_by_xpath(
            "//button[@data-test='year-sort-button']"
        )
        year_sort_button.click()
        time.sleep(3)
        should_list = csv_titles_by_year("Action")
        displayed_list = displayed_text_as_list(
            driver.find_element_by_xpath("//div[@data-test='movie-list']").text
        )
        self.assertTrue(should_list == displayed_list)

        # # arrow up to Comedy
        # arrow_up = driver.find_element_by_xpath(
        #     "//button[@data-test='genres-forward-button']"
        # )
        # arrow_up.click()
        # time.sleep(1)
        # selected_genre = driver.find_element_by_xpath(
        #     "//h2[@data-test='selected-genre']"
        # ).text
        # self.assertTrue("Comedy" in selected_genre)
        # displayed_movie_list = driver.find_element_by_xpath(
        #     "//div[@data-test='movie-list']"
        # ).text
        # self.assertFalse("Looper" in displayed_movie_list)
        # self.assertTrue("Hancock" in displayed_movie_list)
        #
        # # arrow up to Documentary
        # arrow_up = driver.find_element_by_xpath(
        #     "//button[@data-test='genres-forward-button']"
        # )
        # arrow_up.click()
        # time.sleep(1)
        # selected_genre = driver.find_element_by_xpath(
        #     "//h2[@data-test='selected-genre']"
        # ).text
        # self.assertTrue("Documentary" in selected_genre)
        # displayed_movie_list = driver.find_element_by_xpath(
        #     "//div[@data-test='movie-list']"
        # ).text
        # self.assertFalse("Ain't Them Bodies Saints" in displayed_movie_list)
        # self.assertTrue(
        #     "American Experience: The Island Murder" in displayed_movie_list
        # )
        #
        # # arrow up to Drama
        # arrow_up = driver.find_element_by_xpath(
        #     "//button[@data-test='genres-forward-button']"
        # )
        # arrow_up.click()
        # time.sleep(1)
        # selected_genre = driver.find_element_by_xpath(
        #     "//h2[@data-test='selected-genre']"
        # ).text
        # self.assertTrue("Drama" in selected_genre)
        # displayed_movie_list = driver.find_element_by_xpath(
        #     "//div[@data-test='movie-list']"
        # ).text
        # self.assertFalse("The Lookout" in displayed_movie_list)
        # self.assertTrue("Room" in displayed_movie_list)
        #
        # # arrow up to Horror
        # arrow_up = driver.find_element_by_xpath(
        #     "//button[@data-test='genres-forward-button']"
        # )
        # arrow_up.click()
        # time.sleep(1)
        # selected_genre = driver.find_element_by_xpath(
        #     "//h2[@data-test='selected-genre']"
        # ).text
        # self.assertTrue("Horror" in selected_genre)
        # displayed_movie_list = driver.find_element_by_xpath(
        #     "//div[@data-test='movie-list']"
        # ).text
        # self.assertFalse("Molly's Game" in displayed_movie_list)
        # self.assertTrue("The Loved Ones" in displayed_movie_list)
        #
        # # arrow up to Mystery & Suspense
        # arrow_up = driver.find_element_by_xpath(
        #     "//button[@data-test='genres-forward-button']"
        # )
        # arrow_up.click()
        # time.sleep(1)
        # selected_genre = driver.find_element_by_xpath(
        #     "//h2[@data-test='selected-genre']"
        # ).text
        # self.assertTrue("Mystery & Suspense" in selected_genre)
        # displayed_movie_list = driver.find_element_by_xpath(
        #     "//div[@data-test='movie-list']"
        # ).text
        # self.assertFalse("Lars and the Real Girl" in displayed_movie_list)
        # self.assertTrue("The Guilty" in displayed_movie_list)
        #
        # # arrow up to Romance
        # arrow_up = driver.find_element_by_xpath(
        #     "//button[@data-test='genres-forward-button']"
        # )
        # arrow_up.click()
        # time.sleep(1)
        # selected_genre = driver.find_element_by_xpath(
        #     "//h2[@data-test='selected-genre']"
        # ).text
        # self.assertTrue("Romance" in selected_genre)
        # displayed_movie_list = driver.find_element_by_xpath(
        #     "//div[@data-test='movie-list']"
        # ).text
        # self.assertFalse("The Invitation" in displayed_movie_list)
        # self.assertTrue("Three Colors: Red" in displayed_movie_list)
        #
        # # arrow up to Sci-Fi & Fantasy
        # arrow_up = driver.find_element_by_xpath(
        #     "//button[@data-test='genres-forward-button']"
        # )
        # arrow_up.click()
        # time.sleep(1)
        # selected_genre = driver.find_element_by_xpath(
        #     "//h2[@data-test='selected-genre']"
        # ).text
        # self.assertTrue("Sci-Fi & Fantasy" in selected_genre)
        # displayed_movie_list = driver.find_element_by_xpath(
        #     "//div[@data-test='movie-list']"
        # ).text
        # self.assertFalse("Winter's Bone" in displayed_movie_list)
        # self.assertTrue("Unbreakable" in displayed_movie_list)
        #
        # # arrow up to All
        # arrow_up = driver.find_element_by_xpath(
        #     "//button[@data-test='genres-forward-button']"
        # )
        # arrow_up.click()
        # time.sleep(1)
        # selected_genre = driver.find_element_by_xpath(
        #     "//h2[@data-test='selected-genre']"
        # ).text
        # self.assertTrue("All" in selected_genre)
        # displayed_movie_list = driver.find_element_by_xpath(
        #     "//div[@data-test='movie-list']"
        # ).text
        # with open("../data_loader/movies.csv") as movies:
        #     for movie in csv.reader(movies):
        #         self.assertTrue(movie[0] in displayed_movie_list)
        #
        # # arrow up AGAIN to Action
        # arrow_up = driver.find_element_by_xpath(
        #     "//button[@data-test='genres-forward-button']"
        # )
        # arrow_up.click()
        # time.sleep(1)
        # selected_genre = driver.find_element_by_xpath(
        #     "//h2[@data-test='selected-genre']"
        # ).text
        # self.assertTrue("Action" in selected_genre)
        # displayed_movie_list = driver.find_element_by_xpath(
        #     "//div[@data-test='movie-list']"
        # ).text
        # self.assertFalse("Mud" in displayed_movie_list)
        # self.assertTrue("Train to Busan" in displayed_movie_list)
        #
        # # arrow up AGAIN to Comedy
        # arrow_up = driver.find_element_by_xpath(
        #     "//button[@data-test='genres-forward-button']"
        # )
        # arrow_up.click()
        # time.sleep(1)
        # selected_genre = driver.find_element_by_xpath(
        #     "//h2[@data-test='selected-genre']"
        # ).text
        # self.assertTrue("Comedy" in selected_genre)
        # displayed_movie_list = driver.find_element_by_xpath(
        #     "//div[@data-test='movie-list']"
        # ).text
        # self.assertFalse("The Babadook" in displayed_movie_list)
        # self.assertTrue("Damsels in Distress" in displayed_movie_list)
        #
        # """ TEST BACK ARROW """
        # # arrow back to Action
        # arrow_back = driver.find_element_by_xpath(
        #     "//button[@data-test='genres-back-button']"
        # )
        # arrow_back.click()
        # time.sleep(1)
        # selected_genre = driver.find_element_by_xpath(
        #     "//h2[@data-test='selected-genre']"
        # ).text
        # self.assertTrue("Action" in selected_genre)
        # displayed_movie_list = driver.find_element_by_xpath(
        #     "//div[@data-test='movie-list']"
        # ).text
        # self.assertFalse("Creep" in displayed_movie_list)
        # self.assertTrue("The Crazies" in displayed_movie_list)
        #
        # # arrow back to All
        # arrow_back = driver.find_element_by_xpath(
        #     "//button[@data-test='genres-back-button']"
        # )
        # arrow_back.click()
        # time.sleep(1)
        # selected_genre = driver.find_element_by_xpath(
        #     "//h2[@data-test='selected-genre']"
        # ).text
        # self.assertTrue("All" in selected_genre)
        # displayed_movie_list = driver.find_element_by_xpath(
        #     "//div[@data-test='movie-list']"
        # ).text
        # with open("../data_loader/movies.csv") as movies:
        #     for movie in csv.reader(movies):
        #         self.assertTrue(movie[0] in displayed_movie_list)
        #
        # # arrow back to Sci-Fi & Fantasy
        # arrow_back = driver.find_element_by_xpath(
        #     "//button[@data-test='genres-back-button']"
        # )
        # arrow_back.click()
        # time.sleep(1)
        # selected_genre = driver.find_element_by_xpath(
        #     "//h2[@data-test='selected-genre']"
        # ).text
        # self.assertTrue("Sci-Fi & Fantasy" in selected_genre)
        # displayed_movie_list = driver.find_element_by_xpath(
        #     "//div[@data-test='movie-list']"
        # ).text
        # self.assertFalse(
        #     "There's Something Wrong with Aunt Diane" in displayed_movie_list
        # )
        # self.assertTrue("Colossal" in displayed_movie_list)
        #
        # # arrow back to Romance
        # arrow_back = driver.find_element_by_xpath(
        #     "//button[@data-test='genres-back-button']"
        # )
        # arrow_back.click()
        # time.sleep(1)
        # selected_genre = driver.find_element_by_xpath(
        #     "//h2[@data-test='selected-genre']"
        # ).text
        # self.assertTrue("Romance" in selected_genre)
        # displayed_movie_list = driver.find_element_by_xpath(
        #     "//div[@data-test='movie-list']"
        # ).text
        # self.assertFalse("True Adolescents" in displayed_movie_list)
        # self.assertTrue("Nothing But a Man" in displayed_movie_list)
        #
        # # arrow back to Mystery & Suspense
        # arrow_back = driver.find_element_by_xpath(
        #     "//button[@data-test='genres-back-button']"
        # )
        # arrow_back.click()
        # time.sleep(1)
        # selected_genre = driver.find_element_by_xpath(
        #     "//h2[@data-test='selected-genre']"
        # ).text
        # self.assertTrue("Mystery & Suspense" in selected_genre)
        # displayed_movie_list = driver.find_element_by_xpath(
        #     "//div[@data-test='movie-list']"
        # ).text
        # self.assertFalse("Force Majeure" in displayed_movie_list)
        # self.assertTrue("Cold Weather" in displayed_movie_list)
        #
        # # arrow back to Horror
        # arrow_back = driver.find_element_by_xpath(
        #     "//button[@data-test='genres-back-button']"
        # )
        # arrow_back.click()
        # time.sleep(1)
        # selected_genre = driver.find_element_by_xpath(
        #     "//h2[@data-test='selected-genre']"
        # ).text
        # self.assertTrue("Horror" in selected_genre)
        # displayed_movie_list = driver.find_element_by_xpath(
        #     "//div[@data-test='movie-list']"
        # ).text
        # self.assertFalse("Emo the Musical" in displayed_movie_list)
        # self.assertTrue("Raw" in displayed_movie_list)
        #
        # # arrow back to Drama
        # arrow_back = driver.find_element_by_xpath(
        #     "//button[@data-test='genres-back-button']"
        # )
        # arrow_back.click()
        # time.sleep(1)
        # selected_genre = driver.find_element_by_xpath(
        #     "//h2[@data-test='selected-genre']"
        # ).text
        # self.assertTrue("Drama" in selected_genre)
        # displayed_movie_list = driver.find_element_by_xpath(
        #     "//div[@data-test='movie-list']"
        # ).text
        # self.assertFalse("The Lady Vanishes" in displayed_movie_list)
        # self.assertTrue("The Founder" in displayed_movie_list)
        #
        # # arrow back to Documentary
        # arrow_back = driver.find_element_by_xpath(
        #     "//button[@data-test='genres-back-button']"
        # )
        # arrow_back.click()
        # time.sleep(1)
        # selected_genre = driver.find_element_by_xpath(
        #     "//h2[@data-test='selected-genre']"
        # ).text
        # self.assertTrue("Documentary" in selected_genre)
        # displayed_movie_list = driver.find_element_by_xpath(
        #     "//div[@data-test='movie-list']"
        # ).text
        # self.assertFalse("The Good Girl" in displayed_movie_list)
        # self.assertTrue("Pelada" in displayed_movie_list)
        #
        # # arrow back to Comedy
        # arrow_back = driver.find_element_by_xpath(
        #     "//button[@data-test='genres-back-button']"
        # )
        # arrow_back.click()
        # time.sleep(1)
        # selected_genre = driver.find_element_by_xpath(
        #     "//h2[@data-test='selected-genre']"
        # ).text
        # self.assertTrue("Comedy" in selected_genre)
        # displayed_movie_list = driver.find_element_by_xpath(
        #     "//div[@data-test='movie-list']"
        # ).text
        # self.assertFalse("I Like Killing Flies" in displayed_movie_list)
        # self.assertTrue("We Are the Best!" in displayed_movie_list)
        #
        # # arrow back to Action
        # arrow_back = driver.find_element_by_xpath(
        #     "//button[@data-test='genres-back-button']"
        # )
        # arrow_back.click()
        # time.sleep(1)
        # selected_genre = driver.find_element_by_xpath(
        #     "//h2[@data-test='selected-genre']"
        # ).text
        # self.assertTrue("Action" in selected_genre)
        # displayed_movie_list = driver.find_element_by_xpath(
        #     "//div[@data-test='movie-list']"
        # ).text
        # self.assertFalse("Tucker & Dale vs. Evil" in displayed_movie_list)
        # self.assertTrue("Warrior" in displayed_movie_list)
        #
        # # arrow back to All
        # arrow_back = driver.find_element_by_xpath(
        #     "//button[@data-test='genres-back-button']"
        # )
        # arrow_back.click()
        # time.sleep(1)
        # selected_genre = driver.find_element_by_xpath(
        #     "//h2[@data-test='selected-genre']"
        # ).text
        # self.assertTrue("All" in selected_genre)
        # displayed_movie_list = driver.find_element_by_xpath(
        #     "//div[@data-test='movie-list']"
        # ).text
        # with open("../data_loader/movies.csv") as movies:
        #     for movie in csv.reader(movies):
        #         self.assertTrue(movie[0] in displayed_movie_list)
        #
        # # arrow back AGAIN to Sci-Fi & Fantasy
        # arrow_back = driver.find_element_by_xpath(
        #     "//button[@data-test='genres-back-button']"
        # )
        # arrow_back.click()
        # time.sleep(1)
        # selected_genre = driver.find_element_by_xpath(
        #     "//h2[@data-test='selected-genre']"
        # ).text
        # self.assertTrue("Sci-Fi & Fantasy" in selected_genre)
        # displayed_movie_list = driver.find_element_by_xpath(
        #     "//div[@data-test='movie-list']"
        # ).text
        # self.assertFalse("The Taking of Pelham One Two Three" in displayed_movie_list)
        # self.assertTrue("The Last Starfighter" in displayed_movie_list)
        #
        # # arrow back AGAIN to Romance
        # arrow_back = driver.find_element_by_xpath(
        #     "//button[@data-test='genres-back-button']"
        # )
        # arrow_back.click()
        # time.sleep(1)
        # selected_genre = driver.find_element_by_xpath(
        #     "//h2[@data-test='selected-genre']"
        # ).text
        # self.assertTrue("Romance" in selected_genre)
        # displayed_movie_list = driver.find_element_by_xpath(
        #     "//div[@data-test='movie-list']"
        # ).text
        # self.assertFalse("Jeff, Who Lives at Home" in displayed_movie_list)
        # self.assertTrue("Lars and the Real Girl" in displayed_movie_list)
        #
        # """ TEST SORT """
        # """ TEST MENU """

    # def test_create_user(self):
    #     print("test_create_user")
    #
    #     """ create user (via frontend) """
    #     driver = self.driver
    #     driver.get(self.get_server_url() + "/createaccount")
    #     #            ("//div[@data-test='movie-list']")
    #
    #     name_input = driver.find_element_by_xpath(
    #         "//input[@data-test='create-account-username-input']"
    #     )
    #     name_input.send_keys("sampleuser123")
    #     pass_input = driver.find_element_by_xpath(
    #         "//input[@data-test='create-account-password-input']"
    #     )
    #     pass_input.send_keys("password")
    #     time.sleep(1)
    #     submit_button = driver.find_element_by_xpath(
    #         "//input[@data-test='create-account-submit-button']"
    #     )
    #     submit_button.click()
    #     time.sleep(2)
    #
    #     """ expect to see modal response """
    #     displayed_modal = driver.find_element_by_xpath(
    #         "//div[@data-test='create-account-message-modal']"
    #     ).text
    #     self.assertTrue("Thank you for creating account." in displayed_modal)
    #
    #     """ sampleuser123 SHOULD exist in db (backend) """
    #     self.assertFalse(User.query.filter_by(name="sampleuser123").first() == None)

    # def test_sign_in_user(self):
    #     print("test_sign_in_user")
    #
    #     """ create user """
    #     sampleuser123 = User(name="sampleuser123")
    #     sampleuser123.set_password("password")
    #     db.session.add(sampleuser123)
    #     db.session.commit()
    #
    #     """ sign in user (via frontend) """
    #     driver = self.driver
    #     driver.get(self.get_server_url() + "/signin")
    #     name_input = driver.find_element_by_xpath(
    #         "//input[@data-test='signin-username-input']"
    #     )
    #     name_input.send_keys("sampleuser123")
    #     pass_input = driver.find_element_by_xpath(
    #         "//input[@data-test='signin-password-input']"
    #     )
    #     pass_input.send_keys("password")
    #     time.sleep(1)
    #     submit_button = driver.find_element_by_xpath(
    #         "//input[@data-test='signin-submit-button']"
    #     )
    #     submit_button.click()
    #     time.sleep(2)
    #
    #     """ expect to see modal """
    #     displayed_modal = driver.find_element_by_xpath(
    #         "//div[@data-test='signin-message-modal']"
    #     ).text
    #     self.assertTrue("Now signed in as sampleuser123." in displayed_modal)
    #
    #     """ expect to see a token in localStorage """

    # def test_save_unsave_movies(self):
    #     print('test_save_unsave_movies')
    #
    #     """ add user 1 and 96 movies including comingsoon (via backend) """
    #     crg253 = User(username="crg253")
    #     crg253.set_password("crg253password")
    #     db.session.add(crg253)
    #     comingsoon = Movie(
    #         uniquename="comingsoon",
    #         name="Coming Soon",
    #         year=2019,
    #         video_link="https://www.youtube.com/embed/RODwmMxLKa0",
    #         recommender_id=1,
    #     )
    #     db.session.add(comingsoon)
    #     db.session.commit()
    #     load_movies("../data_loader/movies.csv")
    #
    #     """ create user """
    #     sampleuser123 = User(username='sampleuser123')
    #     sampleuser123.set_password('password')
    #     db.session.add(sampleuser123)
    #     db.session.commit()
    #     time.sleep(5)
    #
    #     """ sign in """
    #     driver = self.driver
    #     driver.get(self.get_server_url()+ "/signin")
    #     name_input = driver.find_element_by_xpath(
    #         "//input[@data-test='signin-username-input']"
    #     )
    #     name_input.send_keys("sampleuser123")
    #     pass_input = driver.find_element_by_xpath(
    #         "//input[@data-test='signin-password-input']"
    #     )
    #     pass_input.send_keys("password")
    #     time.sleep(1)
    #     submit_button = driver.find_element_by_xpath(
    #         "//input[@data-test='signin-submit-button']"
    #     )
    #     submit_button.click()
    #     time.sleep(2)
    #
    #     """ save three movies with trailer button """
    #     driver.get(self.get_server_url()+"/romance/aintthembodiessaints2013")
    #     time.sleep(2)
    #     save_button = driver.find_element_by_xpath(
    #         "//button[@data-test='trailer-save-button']"
    #     )
    #     save_button.click()
    #     time.sleep(2)
    #
    #     driver.get(self.get_server_url()+"/comedy/alltherealgirls2003")
    #     time.sleep(2)
    #     save_button = driver.find_element_by_xpath(
    #         "//button[@data-test='trailer-save-button']"
    #     )
    #     save_button.click()
    #     time.sleep(2)
    #
    #     driver.get(self.get_server_url()+"/documentary/americanexperiencetheislandmurder2018")
    #     time.sleep(2)
    #     save_button = driver.find_element_by_xpath(
    #         "//button[@data-test='trailer-save-button']"
    #     )
    #     save_button.click()
    #     time.sleep(2)
    #
    #     """ expect to see 3 movies saved in /usermovies """
    #     driver.get(self.get_server_url()+"/usermovies")
    #     time.sleep(2)
    #     displayed_movies = driver.find_element_by_xpath(
    #         "//div[@data-test='user-saved-movies']"
    #     ).text
    #     self.assertTrue("Ain't Them Bodies Saints" in displayed_movies)
    #     self.assertTrue("All the Real Girls" in displayed_movies)
    #     self.assertTrue("American Experience: The Island Murder" in displayed_movies)
    #
    #     """ expect to see 3 movies in sampleuser123.saves """
    #
    #     """ unsave one movie with trailer button """
    #     driver.get(self.get_server_url()+"/romance/aintthembodiessaints2013")
    #     time.sleep(2)
    #     unsave_button = driver.find_element_by_xpath(
    #         "//button[@data-test='trailer-unsave-button']"
    #     )
    #     unsave_button.click()
    #     time.sleep(2)
    #
    #     """ expect to see 2 movies saved in /usermovies """
    #     driver.get(self.get_server_url()+"/usermovies")
    #     time.sleep(2)
    #     displayed_movies = driver.find_element_by_xpath(
    #         "//div[@data-test='user-saved-movies']"
    #     ).text
    #     self.assertFalse("Ain't Them Bodies Saints" in displayed_movies)
    #     self.assertTrue("All the Real Girls" in displayed_movies)
    #     self.assertTrue("American Experience: The Island Murder" in displayed_movies)
    #
    #     """ expect to see 2 movies in sampleuser123.saves """
    #
    #     """ unsave movie with /usermovies unsave button """
    #     unsave_button = driver.find_element_by_xpath(
    #         "//button[@data-test='user-movies-alltherealgirls2003-unsave-button']"
    #     )
    #     unsave_button.click()
    #     time.sleep(2)
    #
    #     """ expect to see only one movie left """
    #     displayed_movies = driver.find_element_by_xpath(
    #         "//div[@data-test='user-saved-movies']"
    #     ).text
    #     self.assertFalse("Ain't Them Bodies Saints" in displayed_movies)
    #     self.assertFalse("All the Real Girls" in displayed_movies)
    #     self.assertTrue("American Experience: The Island Murder" in displayed_movies)
    #
    #     """ expect to see 1 movies in sampleuser123.saves """

    # def test_suggest_unsuggest(self):
    #     print('test_suggest_unsuggest')
    #
    #     """ create user """
    #     laura = User(username="laura")
    #     laura.set_password("laurapassword")
    #     db.session.add(laura)
    #     db.session.commit()
    #     time.sleep(5)
    #
    #     """ sign in """
    #     driver = self.driver
    #     driver.get(self.get_server_url() + "/signin")
    #     name_input = driver.find_element_by_xpath(
    #         "//input[@data-test='signin-username-input']"
    #     )
    #     name_input.send_keys("laura")
    #     pass_input = driver.find_element_by_xpath(
    #         "//input[@data-test='signin-password-input']"
    #     )
    #     pass_input.send_keys("laurapassword")
    #     time.sleep(1)
    #     submit_button = driver.find_element_by_xpath(
    #         "//input[@data-test='signin-submit-button']"
    #     )
    #     submit_button.click()
    #     time.sleep(2)
    #
    #     """ suggest movie 1 """
    #     driver.get(self.get_server_url() + "/recommend")
    #     movie_search_input = driver.find_element_by_xpath(
    #         "//input[@data-test='recommend-movie-title-search-input']"
    #     )
    #     movie_search_input.send_keys("Karate Kid")
    #     submit_button = driver.find_element_by_xpath(
    #         "//input[@data-test='recommend-submit-search-button']"
    #     )
    #     submit_button.click()
    #     time.sleep(3)
    #
    #     suggest_button = driver.find_element_by_xpath(
    #         "//button[@data-test='recommend-search-result-add-button-0']"
    #     )
    #     suggest_button.click()
    #     time.sleep(3)
    #
    #     displayed_modal = driver.find_element_by_xpath(
    #         "//div[@data-test='recommend-message-modal']"
    #     ).text
    #     self.assertTrue("Thank you for suggesting!" in displayed_modal)
    #     modal_button = driver.find_element_by_xpath(
    #         "//button[@data-test='modal-response-button']"
    #     )
    #     modal_button.click()
    #     time.sleep(1)
    #
    #     """ suggest movie 2 """
    #     movie_search_input = driver.find_element_by_xpath(
    #         "//input[@data-test='recommend-movie-title-search-input']"
    #     )
    #     movie_search_input.send_keys("Ghostbusters")
    #     submit_button = driver.find_element_by_xpath(
    #         "//input[@data-test='recommend-submit-search-button']"
    #     )
    #     submit_button.click()
    #     time.sleep(3)
    #
    #     suggest_button = driver.find_element_by_xpath(
    #         "//button[@data-test='recommend-search-result-add-button-2']"
    #     )
    #     suggest_button.click()
    #     time.sleep(3)
    #
    #     displayed_modal = driver.find_element_by_xpath(
    #         "//div[@data-test='recommend-message-modal']"
    #     ).text
    #     self.assertTrue("Thank you for suggesting!" in displayed_modal)
    #     modal_button = driver.find_element_by_xpath(
    #         "//button[@data-test='modal-response-button']"
    #     )
    #     modal_button.click()
    #     time.sleep(1)
    #
    #     """ suggest movie 3 """
    #     movie_search_input = driver.find_element_by_xpath(
    #         "//input[@data-test='recommend-movie-title-search-input']"
    #     )
    #     movie_search_input.send_keys("The Spy Who Dumped Me")
    #     submit_button = driver.find_element_by_xpath(
    #         "//input[@data-test='recommend-submit-search-button']"
    #     )
    #     submit_button.click()
    #     time.sleep(3)
    #
    #     suggest_button = driver.find_element_by_xpath(
    #         "//button[@data-test='recommend-search-result-add-button-0']"
    #     )
    #     suggest_button.click()
    #     time.sleep(3)
    #
    #     displayed_modal = driver.find_element_by_xpath(
    #         "//div[@data-test='recommend-message-modal']"
    #     ).text
    #     self.assertTrue("Thank you for suggesting!" in displayed_modal)
    #     modal_button = driver.find_element_by_xpath(
    #         "//button[@data-test='modal-response-button']"
    #     )
    #     modal_button.click()
    #     time.sleep(1)
    #
    #     """ expect to see 3 movies in db """
    #     karatekid = Movie.query.filter_by(uniquename='thekaratekid1984').first()
    #     self.assertTrue(karatekid in laura.recommendations)
    #     ghostbusters = Movie.query.filter_by(uniquename='ghostbusters2016').first()
    #     self.assertTrue(ghostbusters in laura.recommendations)
    #     spywhodumpedme = Movie.query.filter_by(uniquename='thespywhodumpedme2018').first()
    #     self.assertTrue(spywhodumpedme in laura.recommendations)
    #
    #     """ expect to find 3 no trailer elements at /usermovies """
    #     driver.get(self.get_server_url() + "/usermovies")
    #     time.sleep(2)
    #     driver.find_element_by_xpath(
    #         "//div[@data-test='user-own-suggestion-with-no-trailer-thekaratekid1984']"
    #     )
    #     driver.find_element_by_xpath(
    #         "//div[@data-test='user-own-suggestion-with-no-trailer-ghostbusters2016']"
    #     )
    #     driver.find_element_by_xpath(
    #         "//div[@data-test='user-own-suggestion-with-no-trailer-thespywhodumpedme2018']"
    #     )
    #
    #     """ expect to find 3 no trailer elements by laura at /usersuggestions """
    #     driver.get(self.get_server_url() + "/usersuggestions")
    #     time.sleep(2)
    #
    #     suggestion_card_content = driver.find_element_by_xpath(
    #         "//div[@data-test='user-suggestion-with-no-trailer-thekaratekid1984']"
    #     ).text
    #     self.assertTrue('laura' in suggestion_card_content)
    #
    #     driver.find_element_by_xpath(
    #         "//div[@data-test='user-suggestion-with-no-trailer-ghostbusters2016']"
    #     ).text
    #     self.assertTrue('laura' in suggestion_card_content)
    #
    #     driver.find_element_by_xpath(
    #         "//div[@data-test='user-suggestion-with-no-trailer-thespywhodumpedme2018']"
    #     ).text
    #     self.assertTrue('laura' in suggestion_card_content)
    #
    #     """ add video_link to two movies """
    #     karatekid = Movie.query.filter_by(uniquename="thekaratekid1984").first()
    #     karatekid.video_link="https://www.youtube.com/embed/xlnm0NtPoVs"
    #     ghostbusters = Movie.query.filter_by(uniquename="ghostbusters2016").first()
    #     ghostbusters.video_link= "https://www.youtube.com/embed/w3ugHP-yZXw"
    #     db.session.commit()
    #
    #     """ expect to see 2 trailers and one card at /usermovies """
    #     driver.get(self.get_server_url() + "/usermovies")
    #     time.sleep(2)
    #     driver.find_element_by_xpath(
    #         "//div[@data-test='user-own-suggestion-with-trailer-thekaratekid1984']"
    #     )
    #     driver.find_element_by_xpath(
    #         "//div[@data-test='user-own-suggestion-with-trailer-ghostbusters2016']"
    #     )
    #     driver.find_element_by_xpath(
    #         "//div[@data-test='user-own-suggestion-with-no-trailer-thespywhodumpedme2018']"
    #     )
    #
    #     """ expect to see 2 trailers and one card by laura at /usersuggestions """
    #     driver.get(self.get_server_url() + "/usersuggestions")
    #     time.sleep(2)
    #
    #     suggestion_card_content = driver.find_element_by_xpath(
    #         "//div[@data-test='user-suggestion-with-trailer-thekaratekid1984']"
    #     ).text
    #     self.assertTrue('laura' in suggestion_card_content)
    #
    #     driver.find_element_by_xpath(
    #         "//div[@data-test='user-suggestion-with-trailer-ghostbusters2016']"
    #     ).text
    #     self.assertTrue('laura' in suggestion_card_content)
    #
    #     driver.find_element_by_xpath(
    #         "//div[@data-test='user-suggestion-with-no-trailer-thespywhodumpedme2018']"
    #     ).text
    #     self.assertTrue('laura' in suggestion_card_content)
    #
    #     """ unsuggest 1 movie from /usermovies """
    #     driver.get(self.get_server_url() + "/usermovies")
    #     time.sleep(2)
    #     unsuggest_button = driver.find_element_by_xpath(
    #         "//button[@data-test='unsuggest-thekaratekid1984']"
    #     )
    #     unsuggest_button.click()
    #     time.sleep(2)
    #
    #     """ expect to see 1 trailer and one card at /usermovies """
    #     all_suggested_content = driver.find_element_by_xpath(
    #         "//div[@data-test='user-own-suggested']"
    #     ).text
    #     self.assertFalse('Karate Kid' in all_suggested_content)
    #
    #     driver.find_element_by_xpath(
    #         "//div[@data-test='user-own-suggestion-with-trailer-ghostbusters2016']"
    #     )
    #     driver.find_element_by_xpath(
    #         "//div[@data-test='user-own-suggestion-with-no-trailer-thespywhodumpedme2018']"
    #     )
    #
    #     """ expect to see 1 trailer and one card at /usersuggestions """
    #     driver.get(self.get_server_url() + "/usersuggestions")
    #     time.sleep(2)
    #
    #     all_suggested_content = driver.find_element_by_xpath(
    #         "//div[@data-test='user-suggested']"
    #     ).text
    #     self.assertFalse('Karate Kid' in all_suggested_content)
    #
    #     driver.find_element_by_xpath(
    #         "//div[@data-test='user-suggestion-with-trailer-ghostbusters2016']"
    #     ).text
    #     self.assertTrue('laura' in suggestion_card_content)
    #
    #     driver.find_element_by_xpath(
    #         "//div[@data-test='user-suggestion-with-no-trailer-thespywhodumpedme2018']"
    #     ).text
    #     self.assertTrue('laura' in suggestion_card_content)

    # def test_user2_save_user1_movie(self):
    #     print("test_second_user_save_unsave_first_user_movies")
    #
    #     """ create user 1 with 1 movie"""
    #     laura = User(username="laura")
    #     laura.set_password("laurapassword")
    #     karatekid = Movie(
    #         uniquename="thekaratekid1984",
    #         name="Karate Kid",
    #         year=1984,
    #         video_link="https://www.youtube.com/embed/xlnm0NtPoVs",
    #         recommender_id=1,
    #     )
    #     db.session.add(laura)
    #     db.session.add(karatekid)
    #
    #     """ create user 2 """
    #     monkey = User(username="monkey")
    #     monkey.set_password("monkeypassword")
    #     db.session.add(monkey)
    #
    #     db.session.commit()
    #     time.sleep(5)
    #
    #     """ sign in user 2 """
    #     driver = self.driver
    #     driver.get(self.get_server_url() + "/signin")
    #     name_input = driver.find_element_by_xpath(
    #         "//input[@data-test='signin-username-input']"
    #     )
    #     name_input.send_keys("monkey")
    #     pass_input = driver.find_element_by_xpath(
    #         "//input[@data-test='signin-password-input']"
    #     )
    #     pass_input.send_keys("monkeypassword")
    #     time.sleep(1)
    #     submit_button = driver.find_element_by_xpath(
    #         "//input[@data-test='signin-submit-button']"
    #     )
    #     submit_button.click()
    #     time.sleep(2)
    #
    #     """ user 2 save user 1 movie at /usersuggestions """
    #     driver.get(self.get_server_url() + "/usersuggestions")
    #     time.sleep(3)
    #     karatekid_save_button = driver.find_element_by_xpath(
    #         "//button[@data-test='user-suggestion-save-button-thekaratekid1984']"
    #     )
    #     karatekid_save_button.click()
    #     time.sleep(3)
    #
    #     """ check user 1 movie in user2.saves in db """
    #     self.assertTrue(karatekid in monkey.saves)
    #
    #     """ check user 1 movie in user 2 saved at /usermovies """
    #     driver.get(self.get_server_url() + "/usermovies")
    #     time.sleep(3)
    #
    #     all_saved_content = driver.find_element_by_xpath(
    #         "//div[@data-test='user-saved-movies']"
    #     ).text
    #     self.assertTrue("Karate Kid" in all_saved_content)

    # def test_first_load_w_user(self):
    #     pass

    # def test_user_forgot_password(self):
    #     pass

    # def test_user_edit_account(self):
    #     pass

    # def test_user_delete_account(self):
    #     pass


if __name__ == "__main__":
    unittest.main()

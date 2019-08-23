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


def sort_by_title_helper(title):
    # remove 'The' from title
    if title[0:4] == "The ":
        slug = title[4:]
    else:
        slug = title
    to_remove = [" ", "'", ",", "!", ".", ":", "&", "-"]
    for item in to_remove:
        slug = slug.replace(item, "")
    return slug


def sort_by_year_helper(title):
    # remove 'The' from between year and title
    if title[4:8] == "The ":
        slug = title[0:4] + title[8:]
    else:
        slug = title
    to_remove = [" ", "'", ",", "!", ".", ":", "&", "-"]
    for item in to_remove:
        slug = slug.replace(item, "")
    return slug


def get_titles_sorted_by_title(genre_movies):
    # get just the title from each line of genre_movies
    titles = []
    for movie_line in genre_movies:
        titles.append(movie_line[0])
    # sort list
    titles.sort(key=sort_by_title_helper)
    return titles


def get_titles_sorted_by_year(genre_movies):
    # get just the year and title from each line of genre_movies
    year_plus_title = []
    for movie_line in genre_movies:
        year_plus_title.append(movie_line[1] + movie_line[0])
    # sort list of year+title
    year_plus_title.sort(key=sort_by_year_helper)
    # once sorted remove year from each entry
    just_titles = [x[4:] for x in year_plus_title]
    return just_titles


def reduce_movie_csv(genre):
    # movie_line consists of title, year, video_link, tag, tag, etc
    genre_movies = []
    disregard = ["M", "Cloverfield", "Creep"]
    with open("../data_loader/movies.csv") as movies:
        for movie_line in csv.reader(movies):
            if movie_line[0] not in disregard:
                if genre in movie_line[3:] or genre == "All":
                    genre_movies.append(movie_line)
    return genre_movies


def csv_sort(sort_type, genre):
    """ each line of movies.csv has title,year,video_link,tag,tag,tag... """
    # first reduce that collection based on genre
    filtered_csv = reduce_movie_csv(genre)
    # then get the titles, sorted by year or title
    if sort_type == "year":
        titles = get_titles_sorted_by_year(filtered_csv)
    else:
        titles = get_titles_sorted_by_title(filtered_csv)
    print(titles)
    return titles


def displayed_text_as_list(displayed_data):
    # create a list of what is displayed
    # make list of all movie titles
    all_titles = []
    for movie_line in reduce_movie_csv("All"):
        all_titles.append(movie_line[0])

    #  make dict of location of each title in data (if displayed)
    location = {}
    for title in all_titles:
        if displayed_data.find(title) != -1:
            location[displayed_data.find(title)] = title
    # sort keys and derive a list of titles from dict
    displayed = []
    for key in sorted(location.keys()):
        displayed.append(location[key])

    return displayed


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(basedir, "endtoend_test.db")
    ELASTICSEARCH_URL = None
    LIVESERVER_PORT = 8943


class EndToEndTest(LiveServerTestCase):
    all_genres = [
        "All",
        "Action",
        "Comedy",
        "Documentary",
        "Drama",
        "Horror",
        "Mystery & Suspense",
        "Romance",
        "Sci-Fi & Fantasy",
    ]

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

    def click_sort(self, driver, sort_type):

        # click requested sort button
        sort_button = driver.find_element_by_xpath(
            "//button[@data-test='" + sort_type + "-sort-button']"
        ).click()
        time.sleep(1)

        displayed_list = displayed_text_as_list(
            driver.find_element_by_xpath("//div[@data-test='movie-list']").text
        )

        print(displayed_list)
        return displayed_list

    def add_user_1_and_101_movies(self):
        # add user 1 and 101 movies including comingsoon (via backend)
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

    def go_to_all_movies_page(self, driver):
        driver.get(self.get_server_url() + "/all/comingsoon")
        time.sleep(3)

    def fill_create_user_form(self, driver, name, password):
        name_input = driver.find_element_by_xpath(
            "//input[@data-test='create-account-username-input']"
        )
        name_input.send_keys(name)
        pass_input = driver.find_element_by_xpath(
            "//input[@data-test='create-account-password-input']"
        )
        pass_input.send_keys(password)
        time.sleep(1)
        submit_button = driver.find_element_by_xpath(
            "//input[@data-test='create-account-submit-button']"
        )
        submit_button.click()
        time.sleep(3)

    def fill_sign_in_form(self, driver, name, password):
        name_input = driver.find_element_by_xpath(
            "//input[@data-test='signin-username-input']"
        )
        name_input.send_keys(name)
        pass_input = driver.find_element_by_xpath(
            "//input[@data-test='signin-password-input']"
        )
        pass_input.send_keys(password)
        time.sleep(1)
        submit_button = driver.find_element_by_xpath(
            "//input[@data-test='signin-submit-button']"
        )
        submit_button.click()
        time.sleep(3)

    def expect_modal(self, driver, message):
        modal_message = driver.find_element_by_xpath(
            "//h3[@data-test='modal-message']"
        ).text
        self.assertTrue(message == modal_message)
        modal_button = driver.find_element_by_xpath(
            "//button[@data-test='modal-response-button']"
        )
        modal_button.click()
        time.sleep(2)

    def create_user_and_sign_in(self, driver, name, password):
        # create one user on backend
        user = User(name=name)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        driver = self.driver
        driver.get(self.get_server_url() + "/signin")
        # try to sign in w name but wrong password
        self.fill_sign_in_form(driver, name, password)
        self.expect_modal(driver, "Now signed in as " + name + ".")

    """ Tests """

    def WORKS_test_a_first_load_test_each_movie_trailer(self):
        print("test_a_first_load_test_each_movie_trailer")

        driver = self.driver
        self.add_user_1_and_101_movies()
        # expect 1 user and 101 movies exist in db (backend)
        self.assertTrue(len(User.query.all()) == 1)
        self.assertTrue(len(Movie.query.all()) == 101)

        # visually make sure each video loads
        for slug in [x.slug for x in Movie.query.all()]:
            driver.get(self.get_server_url() + "/all/" + slug)
            time.sleep(2)

    def WORKS_test_b_first_load_test_right_arrows(self):
        print("test_b_first_load_test_right_arrows")

        driver = self.driver
        self.add_user_1_and_101_movies()
        self.go_to_all_movies_page(driver)

        # check that right arrows take you forward through genres
        for genre in (2 * self.all_genres)[1:12]:
            driver.find_element_by_xpath(
                "//button[@data-test='genres-forward-button']"
            ).click()
            time.sleep(1)
            genre_shown = driver.find_element_by_xpath(
                "//h2[@data-test='selected-genre']"
            ).text
            self.assertTrue(genre == genre_shown)

    def WORKS_test_c_first_load_test_left_arrows(self):
        print("test_c_first_load_test_left_arrows")

        driver = self.driver
        self.add_user_1_and_101_movies()
        self.go_to_all_movies_page(driver)

        # check that left arrows take you backward through genres
        for genre in (2 * (self.all_genres[::-1]))[0:11]:
            driver.find_element_by_xpath(
                "//button[@data-test='genres-back-button']"
            ).click()
            time.sleep(1)
            genre_shown = driver.find_element_by_xpath(
                "//h2[@data-test='selected-genre']"
            ).text
            self.assertTrue(genre == genre_shown)

    def WORKS_test_d_first_load_arrow_up_and_test_both_sort_buttons(self):
        print("test_d_first_load_arrow_up_and_test_both_sort_buttons")

        driver = self.driver
        self.add_user_1_and_101_movies()

        # check all movies title and year sort
        self.go_to_all_movies_page(driver)
        self.assertTrue(csv_sort("title", "All") == self.click_sort(driver, "title"))
        self.assertTrue(csv_sort("year", "All") == self.click_sort(driver, "year"))

        # arrow up and test title and year sort for each genre
        for i in range(len(self.all_genres[1:])):
            # arrow up
            arrow_forward = driver.find_element_by_xpath(
                "//button[@data-test='genres-forward-button']"
            )
            arrow_forward.click()
            # get displayed genre
            genre_shown = driver.find_element_by_xpath(
                "//h2[@data-test='selected-genre']"
            ).text
            time.sleep(2)
            # compare what movies should be listed to what is displayed
            self.assertTrue(
                csv_sort("title", genre_shown) == self.click_sort(driver, "title")
            )
            self.assertTrue(
                csv_sort("year", genre_shown) == self.click_sort(driver, "year")
            )

    def WORKS_test_e_first_load_test_menu(self):
        print("test_e_first_load_test_menu")
        self.add_user_1_and_101_movies()
        # open menu
        driver = self.driver
        driver.find_element_by_xpath("//button[@data-test='open-menu-button']").click()
        time.sleep(1)

        # check contents of menu
        menu_content = driver.find_element_by_xpath(
            "//div[@data-test='menu-wrapper']"
        ).text
        should_be_in_menu = [
            "Sign In",
            "Recommend",
            "User Suggestions",
            "About",
            "Contact",
        ]
        should_not_be_in_menu = ["edit account", "delete account", "sign out"]
        for item in should_be_in_menu:
            self.assertTrue(item in menu_content)
        for item in should_not_be_in_menu:
            self.assertFalse(item in menu_content)

        # close menu
        driver.find_element_by_xpath("//button[@data-test='close-menu-button']").click()
        time.sleep(1)

    def WORKS_test_f_first_load_test_no_usersuggestions(self):
        print("test_f_first_load_test_no_usersuggestions")
        self.add_user_1_and_101_movies()

        driver = self.driver
        driver.get(self.get_server_url() + "/usersuggestions")
        time.sleep(2)

        user_suggestions = driver.find_element_by_xpath(
            "//div[@data-test='user-suggested']"
        ).text
        self.assertTrue(user_suggestions == "")

    def WORKS_test_g_first_load_test_no_usermovies(self):
        print("test_g_first_load_test_no_usermovies")
        self.add_user_1_and_101_movies()

        driver = self.driver
        driver.get(self.get_server_url() + "/usermovies")
        time.sleep(2)

        user_saved = driver.find_element_by_xpath(
            "//div[@data-test='user-saved-movies']"
        ).text
        user_own_suggested = driver.find_element_by_xpath(
            "//div[@data-test='user-own-suggested']"
        ).text
        self.assertTrue(user_saved == "")
        self.assertTrue(user_own_suggested == "")

    def WORKS_test_h_create_user_fail_w_fail_modal(self):
        print("test_h_create_user_fail_w_fail_modal")

        # create one user on backend
        monkey = User(name="monkey")
        monkey.set_password("monkeypassword")
        db.session.add(monkey)
        db.session.commit()

        # try to create same user via frontend
        driver = self.driver
        driver.get(self.get_server_url() + "/createaccount")
        self.fill_create_user_form(driver, "monkey", "differentmonkeypassword")
        self.expect_modal(driver, "Sorry, username not available.")

    def WORKS_test_i_create_user_success_w_success_modal(self):
        print("test_i_create_user_success_w_success_modal")

        driver = self.driver
        driver.get(self.get_server_url() + "/createaccount")
        self.fill_create_user_form(driver, "monkey", "monkeypassword")
        self.expect_modal(driver, "Thank you for creating account.")

        # check that user exits in db
        new_user = User.query.filter_by(name="monkey").first()
        self.assertTrue(new_user.name == "monkey")
        self.assertTrue(new_user.check_password("monkeypassword") == True)

    def WORKS_test_j_sign_in_fail_w_fail_modal(self):
        print("test_j_sign_in_fail_w_fail_modal")

        # create one user on backend
        bella = User(name="bella")
        bella.set_password("bellapassword")
        db.session.add(bella)
        db.session.commit()

        driver = self.driver
        driver.get(self.get_server_url() + "/signin")
        # try to sign in w name but wrong password
        self.fill_sign_in_form(driver, "bella", "differentpassword")
        self.expect_modal(driver, "Incorrect username or password.")

        # try to sign in w wrong name and right password
        self.fill_sign_in_form(driver, "bell", "bellapassword")
        self.expect_modal(driver, "Incorrect username or password.")

    def WORKS_test_k_sign_in_success_w_success_modal(self):
        print("test_k_sign_in_success_w_success_modal")

        # create one user on backend
        bella = User(name="bella")
        bella.set_password("bellapassword")
        db.session.add(bella)
        db.session.commit()

        driver = self.driver
        driver.get(self.get_server_url() + "/signin")
        # try to sign in w name but wrong password
        self.fill_sign_in_form(driver, "bella", "bellapassword")
        self.expect_modal(driver, "Now signed in as bella.")

    def test_l_sign_in_menu_display(self):
        print("test_l_sign_in_menu_display")
        driver = self.driver
        self.create_user_and_sign_in(driver, "hazel", "hazelpassword")

    # test_sign_in_save_movie_trailer_page
    # test_sign_in_unsave_movie_trailer_page
    # test_sign_in_recomend_movie
    # test_sign_in_unrecommend_movie
    # test_sign_in_w_data_already_in_db

    # test_redirect_save_movie_trailer_page
    # test_redirect_unsave_movie_trailer_page
    # test_redirect_recommend_movie
    # test_redirect_unrecommend_movie

    # test_user_2_sign_in_save_user_1_movie_usersuggestions
    # test_user_2_sign_in_unsave_user_1_movie_usersuggestions
    # test_user_2_sign_in_unsave_user_1_movie_usermovies

    # test_redirect_user_2_save_user_1_movie_usersuggestions
    # test_redirect_user_2_unsave_user_1_movie_usersuggestions
    # test_redirect_user_2_unsave_user_1_movie_usermovies

    # test_page_refresh


if __name__ == "__main__":
    unittest.main()

import unittest
from urllib.request import urlopen

from flask_testing import LiveServerTestCase
from selenium import webdriver

import os
import sys
import time
import csv
import string
import random

sys.path.append(os.path.abspath("../"))
basedir = os.path.abspath(os.path.dirname(__file__))

from app import create_app, db
from app.models import Movie, Tag, User
from config import DevConfig
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
    return slug.lower()


def sort_by_year_helper(title):
    # remove 'The' from between year and title
    if title[4:8] == "The ":
        slug = title[0:4] + title[8:]
    else:
        slug = title
    to_remove = [" ", "'", ",", "!", ".", ":", "&", "-"]
    for item in to_remove:
        slug = slug.replace(item, "")
    return slug.lower()


def sort_movie_titles_by_title(genre_movies):
    # get just the title from each line of genre_movies
    titles = []
    for movie_line in genre_movies:
        titles.append(movie_line[0])
    # sort list
    titles.sort(key=sort_by_title_helper)
    return titles


def sort_movie_titles_by_year(genre_movies):
    # get just the year and title from each line of genre_movies
    year_plus_title = []
    for movie_line in genre_movies:
        year_plus_title.append(movie_line[1] + movie_line[0])
    # sort list of year+title
    year_plus_title.sort(key=sort_by_year_helper)
    # once sorted remove year from each entry
    just_titles = [x[4:] for x in year_plus_title]
    return just_titles


def filter_movie_collection(genre):
    genre_movies = []
    with open("../data_loader/movies.csv") as movies:
        for movie_line in csv.reader(movies):
            # movie_line consists of title, year, video_link, tag, tag, etc
            if genre in movie_line[3:] or genre == "All":
                genre_movies.append(movie_line)
    return genre_movies


def sort_csv_movie_collection(sort_type, genre):
    movies = filter_movie_collection(genre)
    if sort_type == "year":
        titles = sort_movie_titles_by_year(movies)
    else:
        titles = sort_movie_titles_by_title(movies)
    unuseful_titles_for_comparison = ["M", "Cloverfield", "Creep", "Creep 2"]
    new_titles = [x for x in titles if x not in unuseful_titles_for_comparison]
    return new_titles


def find_titles_in_text(titles, text):
    #  make dict of location of each title in data (if displayed)
    location = {}
    for title in titles:
        if text.find(title) != -1:
            location[text.find(title)] = title
    # sort keys and derive a list of titles from dict
    displayed = []
    for key in sorted(location.keys()):
        displayed.append(location[key])

    return displayed


def remove_unsearchable_movies():
    good_movies = []
    """
    Disregard movies, where titles are contained in other titles.
    """
    disregard = ["M", "Cloverfield", "Creep", "Creep 2"]
    with open("../data_loader/movies.csv") as movies:
        for movie_line in csv.reader(movies):
            # movie_line consists of title, year, video_link, tag, tag, etc
            if movie_line[0] not in disregard:
                good_movies.append(movie_line)
    return good_movies


def get_admin_titles():
    movies = remove_unsearchable_movies()
    # get titles
    titles = []
    for movie_line in movies:
        titles.append(movie_line[0])
    return titles


def find_admin_titles_in_text(displayed_text):
    admin_titles = get_admin_titles()
    titles_as_displayed = find_titles_in_text(admin_titles, displayed_text)

    return titles_as_displayed


class TestConfig(DevConfig):
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

    def click_sort(self, driver, sort_type):

        # click requested sort button
        sort_button = driver.find_element_by_xpath(
            "//button[@data-test='" + sort_type + "-sort-button']"
        ).click()
        time.sleep(1)

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
        time.sleep(2)
        submit_button.click()
        time.sleep(3)

    def create_user_and_sign_in(self, driver, name, password, email=""):
        # create one user on backend
        user = User(name=name)
        if len(email) > 0:
            user.email = email
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        driver = self.driver
        driver.get(self.get_server_url() + "/signin")
        # try to sign in w name but wrong password
        self.fill_sign_in_form(driver, name, password)

    def check_usermovies_saved_text(self, driver, saved_data):
        for slug, title, year in saved_data:
            wrapper_text = driver.find_element_by_xpath(
                "//div[@data-test='saved-trailer-wrapper-" + slug + "']"
            ).text
            self.assertTrue(title in wrapper_text)
            self.assertTrue(year in wrapper_text)
            self.assertTrue("Unsave" in wrapper_text)

    def check_usermovies_saved_elements_exist(self, driver, saved_data):
        for slug, title, year in saved_data:
            for label in ["trailer-", "title-", "year-", "unsave-button-"]:
                driver.find_element_by_xpath(
                    "//*[@data-test='saved-" + label + slug + "']"
                )

    def check_usermovies_saved_order(self, driver, ordered_saved_titles):
        saved_text = driver.find_element_by_xpath(
            "//div[@data-test='saved-movies']"
        ).text
        saved_titles = find_titles_in_text(ordered_saved_titles, saved_text)
        self.assertTrue(ordered_saved_titles == saved_titles)

    def search_and_recommend(self, driver, title):
        movie_search_input = driver.find_element_by_xpath(
            "//input[@data-test='recommend-movie-title-search-input']"
        )
        movie_search_input.send_keys(title)
        submit_button = driver.find_element_by_xpath(
            "//input[@data-test='recommend-submit-search-button']"
        )
        submit_button.click()
        time.sleep(3)

        suggest_button = driver.find_element_by_xpath(
            "//button[@data-test='recommend-search-result-add-button-0']"
        )
        suggest_button.click()
        time.sleep(3)

    def click_through_menu_to(self, driver, location):
        driver.find_element_by_xpath("//button[@data-test='open-menu-button']").click()
        time.sleep(1)
        driver.find_element_by_xpath(
            "//div[@data-test='menu-" + location + "-link']"
        ).click()
        time.sleep(3)

    def add_4_recommendations_with_trailer_on_backend(self, recommender_id):
        marypoppins = Movie(
            slug="marypoppins1964",
            title="Mary Poppins",
            year=1964,
            video_link="https://www.youtube.com/embed/YfkEQDPlb8g",
            recommender_id=recommender_id,
        )
        bumblebee = Movie(
            slug="bumblebee2018",
            title="Bumblebee",
            year=2018,
            video_link="https://www.youtube.com/embed/lcwmDAYt22k",
            recommender_id=recommender_id,
        )
        robocop = Movie(
            slug="robocop1987",
            title="Robocop",
            year=1987,
            video_link="https://www.youtube.com/embed/6tC_5mp3udE",
            recommender_id=recommender_id,
        )
        exorcist = Movie(
            slug="theexorcist1973",
            title="The Exorcist",
            year=1973,
            video_link="https://www.youtube.com/embed/jyW5YXDcIGs",
            recommender_id=recommender_id,
        )

        for movie in [marypoppins, bumblebee, robocop, exorcist]:
            db.session.add(movie)
        db.session.commit()

    def add_4_recommendations_with_no_trailer_on_backend(self, recommender_id):

        taxidriver = Movie(
            slug="taxidriver1976",
            title="Taxi Driver",
            year=1976,
            recommender_id=recommender_id,
        )
        thegodfather = Movie(
            slug="thegodfather1972",
            title="The Godfather",
            year=1972,
            recommender_id=recommender_id,
        )
        rocky = Movie(
            slug="rocky1976", title="Rocky", year=1976, recommender_id=recommender_id
        )
        starwars = Movie(
            slug="starwarsanewhope1977",
            title="Star Wars: A New Hope",
            year=1977,
            recommender_id=recommender_id,
        )
        for movie in [taxidriver, thegodfather, rocky, starwars]:
            db.session.add(movie)
        db.session.commit()

    def check_usermovies_suggested_trailer_text(self, driver, trailers_data):
        for slug, title, year in trailers_data:
            wrapper_text = driver.find_element_by_xpath(
                "//div[@data-test='own-suggestion-trailer-wrapper-" + slug + "']"
            ).text
            self.assertTrue(title in wrapper_text)
            self.assertTrue(year in wrapper_text)
            self.assertTrue("Unsuggest" in wrapper_text)

    def check_usermovies_suggested_trailer_elements_exist(self, driver, trailers_data):
        for slug, title, year in trailers_data:
            for label in ["", "title-", "year-", "unsuggest-button-"]:
                driver.find_element_by_xpath(
                    "//*[@data-test='own-suggestion-trailer-" + label + slug + "']"
                )

    def check_usermovies_suggested_card_text(self, driver, cards_data):
        for slug, title, year in cards_data:
            wrapper_text = driver.find_element_by_xpath(
                "//div[@data-test='own-suggestion-card-wrapper-" + slug + "']"
            ).text
            self.assertTrue("Coming" in wrapper_text)
            self.assertTrue("Soon" in wrapper_text)
            self.assertTrue(title in wrapper_text)
            self.assertTrue(year in wrapper_text)
            self.assertTrue("Unsuggest" in wrapper_text)

    def check_usermovies_suggested_card_elements_exist(self, driver, cards_data):
        for slug, title, year in cards_data:
            for label in ["", "title-", "year-", "unsuggest-button-"]:
                driver.find_element_by_xpath(
                    "//*[@data-test='own-suggestion-card-" + label + slug + "']"
                )

    def check_usermovies_suggested_order(self, driver, ordered_titles):
        own_suggestion_text = driver.find_element_by_xpath(
            "//div[@data-test='own-suggested-wrapper']"
        ).text
        displayed_titles = find_titles_in_text(ordered_titles, own_suggestion_text)
        self.assertTrue(ordered_titles == displayed_titles)

    def check_usersuggestions_trailer_text(self, driver, trailers_data):
        for slug, title, year, user in trailers_data:
            user_suggestion_wrapper = driver.find_element_by_xpath(
                "//div[@data-test='user-suggestion-trailer-wrapper-" + slug + "']"
            ).text
            self.assertTrue(title in user_suggestion_wrapper)
            self.assertTrue(year in user_suggestion_wrapper)
            self.assertTrue("Suggested by " + user in user_suggestion_wrapper)
            self.assertTrue("Save" in user_suggestion_wrapper)

    def check_usersuggestions_trailer_elements_exist(self, driver, trailers_data):
        for slug, title, year, user in trailers_data:
            for label in ["", "title-", "year-", "comment-", "save-button-"]:
                driver.find_element_by_xpath(
                    "//*[@data-test='user-suggestion-trailer-" + label + slug + "']"
                )

    def check_usersuggestions_card_text(self, driver, cards_data):
        for slug, title, year, user in cards_data:
            user_suggestion_wrapper = driver.find_element_by_xpath(
                "//div[@data-test='user-suggestion-card-wrapper-" + slug + "']"
            ).text
            self.assertTrue("Coming" in user_suggestion_wrapper)
            self.assertTrue("Soon" in user_suggestion_wrapper)
            self.assertTrue(title in user_suggestion_wrapper)
            self.assertTrue(year in user_suggestion_wrapper)
            self.assertTrue("Suggested by " + user in user_suggestion_wrapper)

    def check_usersuggestions_card_elements_exist(self, driver, cards_data):
        for slug, title, year, user in cards_data:
            for label in ["", "title-", "year-", "comment-"]:
                driver.find_element_by_xpath(
                    "//*[@data-test='user-suggestion-card-" + label + slug + "']"
                )

    def check_usersuggestions_order(self, driver, ordered_titles):
        user_suggestion_text = driver.find_element_by_xpath(
            "//div[@data-test='user-suggested']"
        ).text
        displayed_titles = find_titles_in_text(ordered_titles, user_suggestion_text)
        self.assertTrue(ordered_titles == displayed_titles)

    def fill_edit_account_form(self, driver, name="", email="", password=""):
        name_input = driver.find_element_by_xpath(
            "//input[@data-test='edit-account-username-input']"
        )
        name_input.send_keys(name)
        email_input = driver.find_element_by_xpath(
            "//input[@data-test='edit-account-email-input']"
        )
        email_input.send_keys(email)
        pass_input = driver.find_element_by_xpath(
            "//input[@data-test='edit-account-password-input']"
        )
        pass_input.send_keys(password)
        time.sleep(1)
        submit_button = driver.find_element_by_xpath(
            "//input[@data-test='edit-account-submit-button']"
        )
        submit_button.click()
        time.sleep(3)

    def expect_edit_account_placeholders(self, driver, name, email):
        name_placeholder = driver.find_element_by_xpath(
            "//input[@data-test='edit-account-username-input']"
        ).get_attribute("placeholder")
        email_placeholder = driver.find_element_by_xpath(
            "//input[@data-test='edit-account-email-input']"
        ).get_attribute("placeholder")
        time.sleep(1)
        self.assertTrue(name_placeholder == name)
        self.assertTrue(email_placeholder == email)
        time.sleep(3)

    def fill_delete_account_form(self, driver, name, password):
        name_input = driver.find_element_by_xpath(
            "//input[@data-test='delete-account-username-input']"
        )
        name_input.send_keys(name)
        pass_input = driver.find_element_by_xpath(
            "//input[@data-test='delete-account-password-input']"
        )
        pass_input.send_keys(password)
        time.sleep(1)
        submit_button = driver.find_element_by_xpath(
            "//input[@data-test='delete-account-submit-button']"
        )
        submit_button.click()
        time.sleep(3)

    """ Tests """

    # test_a home page
    # test_b trailer page

    def test_ba_trailer_page_test_each_movie_trailer(self):

        driver = self.driver
        self.add_user_1_and_101_movies()
        # expect 1 user and 101 movies exist in db (backend)
        self.assertTrue(len(User.query.all()) == 1)
        self.assertTrue(len(Movie.query.all()) == 101)

        self.go_to_all_movies_page(driver)

        # get movies sorted by title from movies.csv
        movie_titles = []
        with open("../data_loader/movies.csv") as movies:
            for movie_line in csv.reader(movies):
                movie_titles.append(movie_line[0])
        movie_titles.sort(key=sort_by_title_helper)
        """
        check that each movie has a link
        click on each link,visually make sure each video loads
        """
        for title in movie_titles:
            slug = Movie.query.filter_by(title=title).first().slug
            driver.find_element_by_xpath(
                "//div[@data-test='movie-list-item-" + slug + "']"
            ).click()
            time.sleep(2)

    def test_bb_trailer_page_right_arrows(self):

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

    def test_bc_trailer_page_left_arrows(self):

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

    def test_bd_trailer_page_arrow_up_and_test_both_sort_buttons(self):

        driver = self.driver
        self.add_user_1_and_101_movies()
        self.go_to_all_movies_page(driver)

        # sort by title and year and check titles
        for sort_type in ["title", "year"]:
            self.click_sort(driver, sort_type)
            displayed_text = driver.find_element_by_xpath(
                "//div[@data-test='movie-list']"
            ).text
            self.assertTrue(
                sort_csv_movie_collection(sort_type, "All")
                == find_admin_titles_in_text(displayed_text)
            )

        # arrow up and test title and year sort for each genre
        for i in range(len(self.all_genres[1:])):
            arrow_forward = driver.find_element_by_xpath(
                "//button[@data-test='genres-forward-button']"
            )
            arrow_forward.click()
            genre_shown = driver.find_element_by_xpath(
                "//h2[@data-test='selected-genre']"
            ).text
            time.sleep(2)

            for sort_type in ["title", "year"]:
                self.click_sort(driver, sort_type)
                displayed_text = driver.find_element_by_xpath(
                    "//div[@data-test='movie-list']"
                ).text
                self.assertTrue(
                    sort_csv_movie_collection(sort_type, genre_shown)
                    == find_admin_titles_in_text(displayed_text)
                )

    # test_c default menu and pages

    def test_ca_default_menu(self):

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

    def test_cb_no_usersuggestions(self):

        self.add_user_1_and_101_movies()

        driver = self.driver
        driver.get(self.get_server_url() + "/usersuggestions")
        time.sleep(2)

        user_suggestions = driver.find_element_by_xpath(
            "//div[@data-test='user-suggested']"
        ).text
        self.assertTrue(user_suggestions == "")

    def test_cc_no_usermovies(self):

        self.add_user_1_and_101_movies()

        driver = self.driver
        driver.get(self.get_server_url() + "/usermovies")
        time.sleep(2)

        user_saved = driver.find_element_by_xpath(
            "//div[@data-test='saved-movies']"
        ).text
        user_own_suggested = driver.find_element_by_xpath(
            "//div[@data-test='own-suggested-wrapper']"
        ).text
        self.assertTrue(user_saved == "")
        self.assertTrue(user_own_suggested == "")

    # test_d create user
    # test_e sign in and do things
    # test_ea sign in

    def test_eaa_sign_in_fail_w_fail_modal(self):

        # create one user on backend
        bella = User(name="hazel")
        bella.set_password("hazelpassword")
        db.session.add(bella)
        db.session.commit()

        driver = self.driver
        driver.get(self.get_server_url() + "/signin")
        # try to sign in w name but wrong password
        self.fill_sign_in_form(driver, "hazel", "differentpassword")
        self.expect_modal(driver, "Incorrect username or password.")

        # try to sign in w wrong name and right password
        self.fill_sign_in_form(driver, "haze", "hazelpassword")
        self.expect_modal(driver, "Incorrect username or password.")

    def test_eac_sign_in_menu_display(self):

        driver = self.driver
        self.create_user_and_sign_in(driver, "monkey", "monkeypassword")

        # open menu
        driver.find_element_by_xpath("//button[@data-test='open-menu-button']").click()
        time.sleep(1)

        # check contents of menu
        menu_content = driver.find_element_by_xpath(
            "//div[@data-test='menu-wrapper']"
        ).text
        should_be_in_menu = [
            "monkey's Movies",
            "Recommend",
            "User Suggestions",
            "About",
            "Contact",
            "edit account",
            "delete account",
            "sign out",
        ]
        for item in should_be_in_menu:
            self.assertTrue(item in menu_content)
        self.assertFalse("Sign In" in menu_content)

        # close menu
        driver.find_element_by_xpath("//button[@data-test='close-menu-button']").click()
        time.sleep(1)

    # test_eb sign in, save, unsave, check output

    def test_eba_sign_in_save_movie_trailer_page(self):

        driver = self.driver
        self.add_user_1_and_101_movies()
        self.create_user_and_sign_in(driver, "bella", "bellapassword")

        # save movie with trailer button
        driver.get(self.get_server_url() + "/romance/aintthembodiessaints2013")
        time.sleep(2)
        save_button = driver.find_element_by_xpath(
            "//button[@data-test='trailer-save-button']"
        )
        save_button.click()
        time.sleep(2)

        # click through menu to /usermovies
        self.click_through_menu_to(driver, "usermovies")

        # expect to see text in saved trailer wrapper
        saved_data = [["aintthembodiessaints2013", "Ain't Them Bodies Saints", "2013"]]
        self.check_usermovies_saved_text(driver, saved_data)

        # expect to see saved movie elements
        self.check_usermovies_saved_elements_exist(driver, saved_data)

    def test_ebb_sign_in_unsave_movie_trailer_page(self):

        driver = self.driver
        self.add_user_1_and_101_movies()
        self.create_user_and_sign_in(driver, "hazel", "hazelpassword")
        # save movie to user on backend
        movie = Movie.query.filter_by(slug="ghostdog1999").first()
        hazel = User.query.filter_by(name="hazel").first()
        hazel.saves.append(movie)
        db.session.commit()

        # expect to see movie saved in /usermovies
        driver.get(self.get_server_url() + "/usermovies")
        time.sleep(2)
        driver.find_element_by_xpath(
            "//div[@data-test='saved-trailer-wrapper-ghostdog1999']"
        )

        # go to trailer page and unsave
        driver.get(self.get_server_url() + "/action/ghostdog1999")
        time.sleep(2)
        unsave_button = driver.find_element_by_xpath(
            "//button[@data-test='trailer-unsave-button']"
        )
        unsave_button.click()
        time.sleep(2)

        # click through menu to /usermovies
        self.click_through_menu_to(driver, "usermovies")

        # expect to see no movies saved in /usermovies
        displayed_movies = driver.find_element_by_xpath(
            "//div[@data-test='saved-movies']"
        ).text
        self.assertTrue(displayed_movies == "")

    def test_ebc_sign_in_unsave_movie_usermovies(self):

        driver = self.driver
        self.add_user_1_and_101_movies()
        self.create_user_and_sign_in(driver, "laura", "laurapassword")
        # save movie to user on backend
        movie = Movie.query.filter_by(slug="looper2012").first()
        laura = User.query.filter_by(name="laura").first()
        laura.saves.append(movie)
        db.session.commit()

        # unsave movie in /usermovies
        driver.get(self.get_server_url() + "/usermovies")
        time.sleep(2)
        unsave_button = driver.find_element_by_xpath(
            "//button[@data-test='saved-unsave-button-looper2012']"
        )
        unsave_button.click()
        time.sleep(2)

        # expect to see no movies
        displayed_movies = driver.find_element_by_xpath(
            "//div[@data-test='saved-movies']"
        ).text
        self.assertTrue(displayed_movies == "")

    def test_ebd_sign_in_multiple_saves_already_in_db(self):

        driver = self.driver
        self.add_user_1_and_101_movies()
        self.create_user_and_sign_in(driver, "bella", "bellapassword")

        # save movies on backend
        saved_data = [
            ["alltherealgirls2003", "All the Real Girls", "2003"],
            ["thebabadook2014", "The Babadook", "2014"],
            ["crumb1994", "Crumb", "1994"],
            ["interstellar2014", "Interstellar", "2014"],
            ["inthebedroom2001", "In the Bedroom", "2001"],
            ["spoorloos1988", "Spoorloos", "1988"],
            [
                "theressomethingwrongwithauntdiane2011",
                "There's Something Wrong with Aunt Diane",
                "2011",
            ],
        ]

        bella = User.query.filter_by(name="bella").first()
        for slug, title, year in saved_data:
            movie_to_save = Movie.query.filter_by(slug=slug).first()
            bella.saves.append(movie_to_save)

        db.session.commit()
        driver.refresh()

        # /usermovies check saved data is correct and in right order
        self.click_through_menu_to(driver, "usermovies")

        self.check_usermovies_saved_text(driver, saved_data)
        self.check_usermovies_saved_elements_exist(driver, saved_data)

        ordered_saved_titles = [x[1] for x in saved_data]
        self.check_usermovies_saved_order(driver, ordered_saved_titles)

    # test_ec sign in, recommend, unrecommend, check output

    def test_eca_sign_in_recomend_movie_fail_w_already_exists_modal(self):

        driver = self.driver
        self.add_user_1_and_101_movies()
        self.create_user_and_sign_in(driver, "monkey", "monkeypassword")

        # go to /recommend, search, and recommend a movie that already exists
        driver.get(self.get_server_url() + "/recommend")
        time.sleep(2)
        self.search_and_recommend(driver, "Hancock")
        self.expect_modal(driver, "Sorry, movie already selected, or not available.")

    def test_ecc_sign_in_recomend_movie_with_trailer(self):

        driver = self.driver
        self.add_user_1_and_101_movies()
        self.create_user_and_sign_in(driver, "hazel", "hazelpassword")

        # go to /recommend, search, and recommend a movie that doesnt exist
        driver.get(self.get_server_url() + "/recommend")
        time.sleep(2)
        self.search_and_recommend(driver, "Ghostbusters")
        self.expect_modal(driver, "Thank you for suggesting!")

        # expect to see movie in db
        ghostbusters = Movie.query.filter_by(slug="ghostbusters1984").first()
        hazel = User.query.filter_by(name="hazel").first()
        self.assertTrue(ghostbusters in hazel.recommendations)

        # add video_link to suggestion
        ghostbusters.video_link = "https://www.youtube.com/embed/6hDkhw5Wkas"
        db.session.commit()
        driver.refresh()

        trailers_data = [["ghostbusters1984", "Ghostbusters", "1984", "hazel"]]

        # /usermovies and /usersuggestions check trailer
        self.click_through_menu_to(driver, "usermovies")
        self.check_usermovies_suggested_trailer_text(
            driver, [x[:3] for x in trailers_data]
        )
        self.check_usermovies_suggested_trailer_elements_exist(
            driver, [x[:3] for x in trailers_data]
        )

        self.click_through_menu_to(driver, "usersuggestions")
        self.check_usersuggestions_trailer_text(driver, trailers_data)
        self.check_usersuggestions_trailer_elements_exist(driver, trailers_data)

    def test_ece_sign_in_unrecommend_trailer_movie(self):

        driver = self.driver
        self.create_user_and_sign_in(driver, "monkey", "monkeypassword")

        # go to /recommend, search, and recommend a movie that doesnt exist
        driver.get(self.get_server_url() + "/recommend")
        time.sleep(2)
        self.search_and_recommend(driver, "Ghostbusters")
        self.expect_modal(driver, "Thank you for suggesting!")

        # add video_link to suggestion
        ghostbusters = Movie.query.filter_by(slug="ghostbusters1984").first()
        ghostbusters.video_link = "https://www.youtube.com/embed/6hDkhw5Wkas"
        db.session.commit()
        driver.refresh()

        self.click_through_menu_to(driver, "usermovies")

        # Unsuggest
        unsuggest_button = driver.find_element_by_xpath(
            "//button[@data-test='own-suggestion-trailer-unsuggest-button-ghostbusters1984']"
        )
        unsuggest_button.click()
        time.sleep(2)

        # expect no suggestions
        suggested_movies = driver.find_element_by_xpath(
            "//div[@data-test='own-suggested-wrapper']"
        ).text
        self.assertTrue(suggested_movies == "")

    def test_ecf_sign_in_check_existing_recommendations_in_usermovies(self):

        driver = self.driver
        self.add_user_1_and_101_movies()
        self.create_user_and_sign_in(driver, "hazel", "hazelpassword")

        # recommend movies on backend
        self.add_4_recommendations_with_trailer_on_backend(2)

        # trailers data that should exist... slugs, titles, and years
        trailers_data = [
            ["bumblebee2018", "Bumblebee", "2018"],
            ["theexorcist1973", "The Exorcist", "1973"],
            ["marypoppins1964", "Mary Poppins", "1964"],
            ["robocop1987", "Robocop", "1987"],
        ]

        # go to /usermovies
        driver.refresh()
        self.click_through_menu_to(driver, "usermovies")
        time.sleep(3)

        # check the text that shows for each trailer and card suggestion
        self.check_usermovies_suggested_trailer_text(driver, trailers_data)

        # check that each suggestion is comprised of certain elements
        self.check_usermovies_suggested_trailer_elements_exist(driver, trailers_data)

        # check that all suggestion titles are in right order (trailers then cards)
        ordered_suggestions = [x[1] for x in trailers_data]
        self.check_usermovies_suggested_order(driver, ordered_suggestions)

    def test_ecg_sign_in_check_existing_recommend_in_usersuggestions(self):

        driver = self.driver
        self.add_user_1_and_101_movies()
        self.create_user_and_sign_in(driver, "hazel", "hazelpassword")

        # recommend movies on backend
        self.add_4_recommendations_with_trailer_on_backend(2)

        # trailers data that should exist... slugs, titles, and years
        trailers_data = [
            ["bumblebee2018", "Bumblebee", "2018", "hazel"],
            ["theexorcist1973", "The Exorcist", "1973", "hazel"],
            ["marypoppins1964", "Mary Poppins", "1964", "hazel"],
            ["robocop1987", "Robocop", "1987", "hazel"],
        ]

        driver.refresh()
        self.click_through_menu_to(driver, "usersuggestions")
        time.sleep(3)

        # check the text visible for each trailer and card suggestion
        self.check_usersuggestions_trailer_text(driver, trailers_data)

        # check that each suggestion is comprised of certain elements
        self.check_usersuggestions_trailer_elements_exist(driver, trailers_data)

        # check that all suggestion titles are in right order (trailers then cards)
        ordered_suggestions = [x[1] for x in trailers_data]
        self.check_usersuggestions_order(driver, ordered_suggestions)

    def test_ech_sign_in_recommendations_in_db_check_admin_movies(self):
        driver = self.driver
        self.add_user_1_and_101_movies()
        self.create_user_and_sign_in(driver, "hazel", "hazelpassword")

        # recommend movies on backend
        self.add_4_recommendations_with_trailer_on_backend(2)

        # trailers data that should exist... slugs, titles, and years
        trailers_data = [
            ["bumblebee2018", "Bumblebee", "2018"],
            ["theexorcist1973", "The Exorcist", "1973"],
            ["marypoppins1964", "Mary Poppins", "1964"],
            ["robocop1987", "Robocop", "1987"],
        ]

        driver.refresh()
        self.click_through_menu_to(driver, "usersuggestions")

        # check that all suggestion titles are in right order
        ordered_suggestions = [x[1] for x in trailers_data]
        self.check_usersuggestions_order(driver, ordered_suggestions)

        # check that suggestions not in admin movies
        self.go_to_all_movies_page(driver)
        displayed_text = driver.find_element_by_xpath(
            "//div[@data-test='movie-list']"
        ).text
        self.assertTrue(find_titles_in_text(ordered_suggestions, displayed_text) == [])

    # test_ed sign in and change account

    def test_eda_sign_in_edit_account_change_name(self):

        driver = self.driver
        self.create_user_and_sign_in(
            driver, "monkey", "monkeypassword", email="monkey@cat.com"
        )

        self.click_through_menu_to(driver, "edit-account")

        # change name
        self.fill_edit_account_form(driver, name="New Name")
        self.expect_modal(driver, "Account updated.")
        self.expect_edit_account_placeholders(driver, "New Name", "monkey@cat.com")

    def test_edb_sign_in_edit_account_change_email(self):

        driver = self.driver
        self.create_user_and_sign_in(
            driver, "bella", "bellapassword", email="bella@dog.com"
        )

        self.click_through_menu_to(driver, "edit-account")

        # change email
        self.fill_edit_account_form(driver, email="newemail@email.com")
        self.expect_modal(driver, "Account updated.")
        self.expect_edit_account_placeholders(driver, "bella", "newemail@email.com")

    def test_edc_sign_in_edit_account_change_name_and_email(self):

        driver = self.driver
        self.create_user_and_sign_in(
            driver, "hazel", "hazelpassword", email="hazel@dog.com"
        )

        self.click_through_menu_to(driver, "edit-account")

        # change name and email
        self.fill_edit_account_form(driver, name="New Name", email="newemail@email.com")
        self.expect_modal(driver, "Account updated.")
        self.expect_edit_account_placeholders(driver, "New Name", "newemail@email.com")

    def test_edd_sign_in_edit_name_re_sign_in(self):

        driver = self.driver
        self.create_user_and_sign_in(driver, "laura", "laurapassword")

        self.click_through_menu_to(driver, "edit-account")

        # change name
        self.fill_edit_account_form(driver, name="New User")
        self.expect_modal(driver, "Account updated.")

        # sign out
        self.click_through_menu_to(driver, "signout")

        # sign in with new password
        self.click_through_menu_to(driver, "signin")
        self.fill_sign_in_form(driver, "New User", "laurapassword")

    def test_ede_sign_in_edit_password_re_sign_in(self):

        driver = self.driver
        self.create_user_and_sign_in(driver, "monkey", "monkeypassword")

        self.click_through_menu_to(driver, "edit-account")

        # change password
        self.fill_edit_account_form(driver, password="New Password")
        self.expect_modal(driver, "Account updated.")

        # sign out
        self.click_through_menu_to(driver, "signout")

        # sign in with new password
        self.click_through_menu_to(driver, "signin")
        self.fill_sign_in_form(driver, "monkey", "New Password")

    def test_edf_sign_in_delete_account_fail(self):

        driver = self.driver
        self.create_user_and_sign_in(driver, "bella", "bellapassword")

        self.click_through_menu_to(driver, "delete-account")

        self.fill_delete_account_form(driver, "bella", "wrongpassword")
        self.expect_modal(driver, "Incorrect username or password.")

    def test_edg_sign_in_delete_account_success(self):

        driver = self.driver
        self.create_user_and_sign_in(driver, "hazel", "hazelpassword")

        self.click_through_menu_to(driver, "delete-account")

        self.fill_delete_account_form(driver, "hazel", "hazelpassword")
        self.expect_modal(driver, "Account deleted.")

        # try to sign in again
        self.click_through_menu_to(driver, "signin")
        self.fill_sign_in_form(driver, "hazel", "hazelpassword")
        self.expect_modal(driver, "Incorrect username or password.")

    # test_f redirect

    def test_fb_fail_save_movie_redirect_to_sign_in_and_back(self):

        driver = self.driver
        self.add_user_1_and_101_movies()

        # create one user on backend
        user = User(name="monkey")
        user.set_password("monkeypassword")
        db.session.add(user)
        db.session.commit()

        # try save movie with trailer button
        driver.get(self.get_server_url() + "/mysteryandsuspense/thief1981")
        time.sleep(2)
        save_button = driver.find_element_by_xpath(
            "//button[@data-test='trailer-save-button']"
        )
        save_button.click()
        time.sleep(3)

        # expect to be redirected to /signin
        title = driver.find_element_by_xpath("//h1[@data-test='signin-title']").text
        self.assertTrue(title == "Sign In")

        self.fill_sign_in_form(driver, "monkey", "monkeypassword")
        time.sleep(3)

        # expect to be redirected back to /mysteryandsuspense/thief1981
        trailer_data = driver.find_element_by_xpath(
            "//h2[@data-test='trailer-title-and-year']"
        ).text
        self.assertTrue("Thief" in trailer_data)

    def test_fc_fail_unsave_trailer_page_redirect_to_sign_in_and_back(self):

        driver = self.driver
        self.add_user_1_and_101_movies()

        self.create_user_and_sign_in(driver, "bella", "bellapassword")
        # add one save on backend
        bella = User.query.filter_by(name="bella").first()
        movie_to_save = Movie.query.filter_by(slug="theladyvanishes1938").first()
        bella.saves.append(movie_to_save)
        db.session.commit()

        # go to page, dump token, then try unsave movie with trailer button
        driver.get(self.get_server_url() + "/mysteryandsuspense/theladyvanishes1938")
        time.sleep(2)
        driver.execute_script("window.localStorage.removeItem('token');")
        unsave_button = driver.find_element_by_xpath(
            "//button[@data-test='trailer-unsave-button']"
        )
        unsave_button.click()
        time.sleep(3)

        # expect to be redirected to /signin
        title = driver.find_element_by_xpath("//h1[@data-test='signin-title']").text
        self.assertTrue(title == "Sign In")

        self.fill_sign_in_form(driver, "bella", "bellapassword")
        time.sleep(3)

        # expect to be redirected back to /mysteryandsuspense/theladyvanishes1938
        trailer_data = driver.find_element_by_xpath(
            "//h2[@data-test='trailer-title-and-year']"
        ).text
        self.assertTrue("The Lady Vanishes" in trailer_data)

    def test_fd_fail_unsave_usermovies_redirect_to_sign_in_and_back(self):

        driver = self.driver
        self.add_user_1_and_101_movies()

        self.create_user_and_sign_in(driver, "hazel", "hazelpassword")
        # add one save on backend
        hazel = User.query.filter_by(name="hazel").first()
        movie_to_save = Movie.query.filter_by(slug="takeshelter2011").first()
        hazel.saves.append(movie_to_save)
        db.session.commit()

        # go to page, dump token, then try unsave movie with trailer button
        driver.get(self.get_server_url() + "/usermovies")
        time.sleep(2)
        driver.execute_script("window.localStorage.removeItem('token');")
        unsave_button = driver.find_element_by_xpath(
            "//button[@data-test='saved-unsave-button-takeshelter2011']"
        )
        unsave_button.click()
        time.sleep(3)

        # expect to be redirected to /signin
        title = driver.find_element_by_xpath("//h1[@data-test='signin-title']").text
        self.assertTrue(title == "Sign In")

        self.fill_sign_in_form(driver, "hazel", "hazelpassword")
        time.sleep(3)

        # expect to be redirected back to /usermovies
        driver.find_element_by_xpath("//p[@data-test='saved-title-takeshelter2011']")

    def test_fe_fail_recommend_redirect_to_sign_in_and_back(self):

        driver = self.driver

        # create one user on backend
        user = User(name="laura")
        user.set_password("laurapassword")
        db.session.add(user)
        db.session.commit()

        driver.get(self.get_server_url() + "/recommend")
        time.sleep(2)

        self.search_and_recommend(driver, "Goonies")

        # expect to be redirected to /signin
        title = driver.find_element_by_xpath("//h1[@data-test='signin-title']").text
        self.assertTrue(title == "Sign In")

        self.fill_sign_in_form(driver, "laura", "laurapassword")
        time.sleep(3)

        # expect to be redirected back to /recommend
        driver.find_element_by_xpath("//label[@data-test='recommend-title']")

    def test_fg_fail_edit_account_redirect_to_sign_in_and_back(self):

        driver = self.driver
        self.create_user_and_sign_in(driver, "bella", "bellapassword")
        driver.get(self.get_server_url() + "/editaccount")
        # dump token to simulate expiration
        driver.execute_script("window.localStorage.removeItem('token');")
        time.sleep(2)
        self.fill_edit_account_form(driver, name="New Name")
        # expect to be redirected to /signin
        time.sleep(2)
        self.fill_sign_in_form(driver, "bella", "bellapassword")
        # expect to be redirected back to /editaccount
        driver.find_element_by_xpath("//form[@data-test='edit-account-form']")

    # test_g user 1 and 2 data exists, sign in USER 3 and do things

    def test_ga_user_3_sign_in_save_user_2_movie_usersuggestions(self):

        driver = self.driver
        self.add_user_1_and_101_movies()

        # create user 2 on backend
        user = User(name="hazel")
        user.set_password("hazelpassword")
        db.session.add(user)
        db.session.commit()

        # user 2 recommend movies on backend
        self.add_4_recommendations_with_trailer_on_backend(2)

        # create user 3
        self.create_user_and_sign_in(driver, "laura", "laurapassword")

        # go to /usersuggestions, save user 2 movie
        driver.get(self.get_server_url() + "/usersuggestions")
        time.sleep(3)
        save_button = driver.find_element_by_xpath(
            "//button[@data-test='user-suggestion-trailer-save-button-bumblebee2018']"
        )
        save_button.click()

        # check movie exists at user 3 /usermovies
        self.click_through_menu_to(driver, "usermovies")
        time.sleep(3)
        # expect to see text in saved trailer wrapper
        saved_data = [["bumblebee2018", "Bumblebee", "2018"]]
        self.check_usermovies_saved_text(driver, saved_data)

        # expect to see saved movie elements
        self.check_usermovies_saved_elements_exist(driver, saved_data)

    def test_gb_user_3_sign_in_save_multiple_admin_and_user_2_movies(self):

        driver = self.driver
        self.add_user_1_and_101_movies()

        # create user 2 on backend and recommend movies
        user = User(name="laura")
        user.set_password("laurapassword")
        db.session.add(user)
        db.session.commit()
        self.add_4_recommendations_with_trailer_on_backend(2)

        # create user 3 and save user 1 movie and 4 user 2 movies on backend
        data_to_save = [
            ["bumblebee2018", "Bumblebee", "2018"],
            ["theexorcist1973", "The Exorcist", "1973"],
            ["larsandtherealgirl2007", "Lars and the Real Girl", "2007"],
            ["marypoppins1964", "Mary Poppins", "1964"],
            ["robocop1987", "Robocop", "1987"],
        ]
        self.create_user_and_sign_in(driver, "monkey", "monkeypassword")

        monkey = User.query.filter_by(name="monkey").first()
        # save the movies in random order on the backend
        shuffled_slugs = [x[0] for x in data_to_save]
        random.shuffle(shuffled_slugs)
        for slug in shuffled_slugs:
            movie_to_save = Movie.query.filter_by(slug=slug).first()
            monkey.saves.append(movie_to_save)
        db.session.commit()

        # check saves exist at user 3 /usermovies
        driver.get(self.get_server_url() + "/usermovies")
        time.sleep(3)

        self.check_usermovies_saved_text(driver, data_to_save)
        self.check_usermovies_saved_elements_exist(driver, data_to_save)

        ordered_saved_titles = [x[1] for x in data_to_save]
        self.check_usermovies_saved_order(driver, ordered_saved_titles)

    def test_gd_user_2_and_3_recommend_videos_check_usermovies_and_usersugg(self):

        driver = self.driver
        self.add_user_1_and_101_movies()

        # create user 2 on backend and recommend movies
        user = User(name="bella")
        user.set_password("bellapassword")
        db.session.add(user)
        db.session.commit()
        self.add_4_recommendations_with_trailer_on_backend(2)

        # create user 3 and recommend 1 movie with video
        self.create_user_and_sign_in(driver, "hazel", "hazelpassword")
        self.click_through_menu_to(driver, "recommend")
        time.sleep(3)
        self.search_and_recommend(driver, "Moneyball")
        self.expect_modal(driver, "Thank you for suggesting!")
        moneyball = Movie.query.filter_by(slug="moneyball2011").first()
        moneyball.video_link = "https://www.youtube.com/embed/-4QPVo0UIzc"
        db.session.commit()
        driver.refresh()

        # check only 1 video at user 3 /usermovies
        user_3_video_data = [["moneyball2011", "Moneyball", "2011"]]

        self.click_through_menu_to(driver, "usermovies")
        time.sleep(4)
        self.check_usermovies_suggested_trailer_text(driver, user_3_video_data)
        self.check_usermovies_suggested_trailer_elements_exist(
            driver, user_3_video_data
        )
        ordered_suggestions = [x[1] for x in user_3_video_data]
        self.check_usermovies_suggested_order(driver, ordered_suggestions)

        # check 5 movies with trailers at /usersuggestions
        trailers_data = [
            ["bumblebee2018", "Bumblebee", "2018", "bella"],
            ["theexorcist1973", "The Exorcist", "1973", "bella"],
            ["marypoppins1964", "Mary Poppins", "1964", "bella"],
            ["moneyball2011", "Moneyball", "2011", "hazel"],
            ["robocop1987", "Robocop", "1987", "bella"],
        ]

        self.click_through_menu_to(driver, "usersuggestions")
        self.check_usersuggestions_trailer_text(driver, trailers_data)
        self.check_usersuggestions_trailer_elements_exist(driver, trailers_data)
        ordered_suggestions = [x[1] for x in trailers_data]
        self.check_usersuggestions_order(driver, ordered_suggestions)

    # def test_user_3_change_name_to_user_2
    # def test_user_3_change_email_to_user_2

    # test_h redirect USER 2
    # def test_redirect_user_2_save_user_1_movie_usersuggestions

    # test_k user flow


if __name__ == "__main__":
    unittest.main()

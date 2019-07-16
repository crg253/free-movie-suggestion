import unittest
from app import create_app, db
from app.models import Movie, Tag, User
from config import Config



class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite://'
    ELASTICSEARCH_URL = None

class UserModelCase(unittest.TestCase):

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

    ''' Test DB Relationships '''

    def create_users_movies_and_tags(self):
        monkey = User(username = 'monkey')
        monkey.set_password('monkeypassword')
        bella = User(username = 'bella')
        bella.set_password('bellapassword')
        hazel = User(username = 'hazel')
        hazel.set_password('hazelpassword')
        movie_1 = Movie(uniquename="movie_1",name="Movie 1", year=2019,status='pending', recommender_id=1)
        movie_2 = Movie(uniquename="movie_2",name="Movie 2", year=2019,status='pending', recommender_id=2)
        movie_3 = Movie(uniquename="movie_3",name="Movie 3", year=2019,status='pending', recommender_id=3)
        action = Tag(name = 'Action')
        comedy = Tag(name = 'Comedy')
        documentary = Tag(name = 'Documentarty')
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
        return monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary

    # Movie Recommender One-to_Many

    def test_movie_recommender_id_property_creates_one_to_many(self):
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = self.create_users_movies_and_tags()
        # check user.recommendations array contains whole movie object
        self.assertTrue(movie_1 in monkey.recommendations)
        # full circle, check movie.recommended_by contains whole user object
        self.assertTrue(movie_1.recommended_by==monkey)

    # Movie Tags Many-to-Many

    def test_movie_tags_array_creates_many_to_many(self):
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = self.create_users_movies_and_tags()
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
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = self.create_users_movies_and_tags()
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
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = self.create_users_movies_and_tags()
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
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = self.create_users_movies_and_tags()
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

    ''' Test Catch All Route '''

    def test_main_page(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)

    ''' Test API Routes'''

    # test add user
    # test sign in
    # test reset password
    # test update account
    # test delete account
    # test suggest movie
    # test unsuggest movie
    # test save movie
    # test unsave movie
    # test check token
    # test get movies


if __name__ == '__main__':
    unittest.main(verbosity=2)

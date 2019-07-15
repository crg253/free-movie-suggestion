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
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    # TEST DB RELATIONSHIPS

    def test_movie_recommender_id_column(self):
        # test movie.recommender_id one-to-many relationship
        monkey = User(username = 'monkey')
        monkey.set_password('monkeypassword')
        movie_1 = Movie(uniquename="movie_1",name="Movie 1", year=0, status='pending', recommender_id=1)
        db.session.add(monkey)
        db.session.add(movie_1)
        db.session.commit()
        self.assertTrue(movie_1.recommended_by==monkey)
        self.assertTrue(movie_1 in monkey.recommendations)

    # test tags many-to-many
    # test saves many-to-many

    # TEST API ROUTES

    def test_main_page(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)

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

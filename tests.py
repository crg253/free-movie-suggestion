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

    def test_movie_recommender_id_property_creates_one_to_many(self):
        monkey = User(username = 'monkey')
        monkey.set_password('monkeypassword')
        movie_1 = Movie(uniquename="movie_1",name="Movie 1", year=2019,status='pending', recommender_id=1)
        db.session.add(monkey)
        db.session.add(movie_1)
        db.session.commit()
        #check user.recommendations array contains whole movie object
        self.assertTrue(movie_1 in monkey.recommendations)
        #full circle, check movie.recommended_by contains whole user object
        self.assertTrue(movie_1.recommended_by==monkey)

    # MOVIE TAGS MANY MANY

    def test_movie_tags_array_creates_many_to_many(self):
        monkey = User(username = 'monkey')
        monkey.set_password('monkeypassword')
        movie_1 = Movie(uniquename="movie_1",name="Movie 1", year=2019,status='pending', recommender_id=1)
        movie_2 = Movie(uniquename="movie_2",name="Movie 2", year=2019,status='pending', recommender_id=1)
        movie_3 = Movie(uniquename="movie_3",name="Movie 3", year=2019,status='pending', recommender_id=1)
        action = Tag(name = 'Action')
        comedy = Tag(name = 'Comedy')
        documentary = Tag(name = 'Documentarty')
        db.session.add(movie_1)
        db.session.add(movie_2)
        db.session.add(movie_3)
        db.session.add(action)
        db.session.add(comedy)
        db.session.add(documentary)
        movie_1.tags.append(action)
        movie_1.tags.append(comedy)
        movie_2.tags.append(comedy)
        movie_2.tags.append(documentary)
        movie_3.tags.append(documentary)
        movie_3.tags.append(action)
        db.session.commit()
        #check the tag.movies array
        self.assertTrue(movie_1 in action.movies)
        self.assertTrue(movie_1 in comedy.movies)
        self.assertTrue(movie_2 in comedy.movies)
        self.assertTrue(movie_2 in documentary.movies)
        self.assertTrue(movie_3 in documentary.movies)
        self.assertTrue(movie_3 in action.movies)

    def test_tag_movies_array_creates_many_to_many(self):
        monkey = User(username = 'monkey')
        monkey.set_password('monkeypassword')
        movie_1 = Movie(uniquename="movie_1",name="Movie 1", year=2019,status='pending', recommender_id=1)
        movie_2 = Movie(uniquename="movie_2",name="Movie 2", year=2019,status='pending', recommender_id=1)
        movie_3 = Movie(uniquename="movie_3",name="Movie 3", year=2019,status='pending', recommender_id=1)
        action = Tag(name = 'Action')
        comedy = Tag(name = 'Comedy')
        documentary = Tag(name = 'Documentarty')
        db.session.add(movie_1)
        db.session.add(movie_2)
        db.session.add(movie_3)
        db.session.add(action)
        db.session.add(comedy)
        db.session.add(documentary)
        action.movies.append(movie_1)
        action.movies.append(movie_2)
        comedy.movies.append(movie_2)
        comedy.movies.append(movie_3)
        documentary.movies.append(movie_3)
        documentary.movies.append(movie_1)
        db.session.commit()
        #check movie.tags array
        self.assertTrue(action in movie_1.tags)
        self.assertTrue(documentary in movie_1.tags)
        self.assertTrue(action in movie_2.tags)
        self.assertTrue(comedy in movie_2.tags)
        self.assertTrue(comedy in movie_3.tags)
        self.assertTrue(documentary in movie_3.tags)





    # test saves many-to-many

    # TEST CATCH ALL ROUTE

    def test_main_page(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)

    # TEST API ROUTES

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

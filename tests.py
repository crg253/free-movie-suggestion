import unittest
from app import create_app, db
from app.models import Movie, Tag, User
from config import Config
from app.api.auth import verify_password, verify_token
import base64
import os
import json

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

    def create_users_movies_and_tags(self):
        # create three users
        monkey = User(username = 'monkey')
        monkey.set_password('monkeypassword')
        monkey.get_token()
        bella = User(username = 'bella')
        bella.set_password('bellapassword')
        bella.get_token()
        hazel = User(username = 'hazel')
        hazel.set_password('hazelpassword')
        hazel.get_token()
        # each user creates one movie
        movie_1 = Movie(uniquename="movie_1",name="Movie 1", year=2019,status='pending', recommender_id=1)
        movie_2 = Movie(uniquename="movie_2",name="Movie 2", year=2019,status='pending', recommender_id=2)
        movie_3 = Movie(uniquename="movie_3",name="Movie 3", year=2019,status='pending', recommender_id=3)
        # create three tags
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

    ''' Test DB Relationships '''

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
        res = self.client.get('/')
        self.assertEqual(res.status_code, 200)

    ''' Test Auth '''

    def test_verify_password(self):
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = self.create_users_movies_and_tags()
        self.assertTrue(verify_password('monkey','monkeypassword'))
        self.assertTrue(verify_password('bella','bellapassword'))
        self.assertFalse(verify_password('monkey','bellapassword'))
        self.assertFalse(verify_password('bella','monkeypassword'))

    def test_verify_token(self):
        #only checks that token exists, not that it belongs to user
        #test_check_token will verify that token returns correct user
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = self.create_users_movies_and_tags()
        self.assertTrue(verify_token(monkey.token))
        self.assertTrue(verify_token(bella.token))
        self.assertTrue(verify_token(hazel.token))
        self.assertFalse(verify_token(base64.b64encode(os.urandom(24)).decode('utf-8')))
        self.assertFalse(verify_token(base64.b64encode(os.urandom(24)).decode('utf-8')))
        self.assertFalse(verify_token(base64.b64encode(os.urandom(24)).decode('utf-8')))

    ''' Test API Routes'''

    def test_check_token(self):
        monkey = self.create_users_movies_and_tags()[0]
        headers = {'Authorization': 'Bearer ' + monkey.token}
        res = self.client.post('/api/checktoken', headers=headers)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json['user'], 'monkey')
        self.assertEqual(res.json['email'], None)

    def test_get_movies_no_user(self):
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = self.create_users_movies_and_tags()
        monkey.saves.append(movie_2)
        bella.saves.append(movie_3)
        hazel.saves.append(movie_1)
        db.session.commit()
        j_data = json.dumps({'user': ''})
        res = self.client.post('/api/get_movies', data=j_data, content_type='application/json')
        self.assertEqual(res.status_code, 200)
        for movie in res.json['movies']:
            self.assertTrue(movie['saved']==False)

    def test_get_movies_user(self):
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = self.create_users_movies_and_tags()
        monkey.saves.append(movie_2)
        bella.saves.append(movie_3)
        hazel.saves.append(movie_1)
        db.session.commit()
        j_data = json.dumps({'user': monkey.username})
        res = self.client.post('/api/get_movies', data=j_data, content_type='application/json')
        self.assertEqual(res.status_code, 200)
        for movie in res.json['movies']:
            if movie['slug']=='movie_2':
                self.assertTrue(movie['saved']==True)
            else:
                self.assertTrue(movie['saved']==False)

    def test_add_user(self):
        monkey, bella, hazel, movie_1, movie_2, movie_3, action, comedy, documentary = self.create_users_movies_and_tags()
        self.assertFalse('laura' in [u.username for u in User.query.all()])
        j_data = json.dumps({'userName':'laura', 'password':'laurapassword', 'email':''})
        res = self.client.post('/api/adduser', data=j_data, content_type='application/json')
        self.assertTrue('laura' in [u.username for u in User.query.all()])

    def test_sign_in(self):
        monkey = self.create_users_movies_and_tags()[0]
        headers = {'Authorization': 'Basic bW9ua2V5Om1vbmtleXBhc3N3b3Jk'}
        res = self.client.post('/api/signin', headers=headers)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json['user'], 'monkey')
        self.assertTrue(res.json['token'] != None)


    # test_reset_password
    # test_update_account
    # test_delete_account
    # test_save_movie
    # test_unsave_movie
    # test_suggest_movie
    # test_unsuggest_movie



if __name__ == '__main__':
    unittest.main(verbosity=2)

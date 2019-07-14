from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

import unittest
from flask_testing import TestCase

class MyTest(TestCase):

    app = Flask(__name__)
    print(app)
    app.config.from_object(Config)
    db = SQLAlchemy(app)
    print(db)
    pass

if __name__ == '__main__':
    unittest.main()

import os

basedir = os.path.abspath(os.path.dirname(__file__))


class BaseConfig(object):
    MAIL_SERVER = os.environ.get("MAIL_SERVER")
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")
    MAIL_PORT = 465
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True

    SECRET_KEY = os.environ.get("SECRET_KEY")

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JSONIFY_PRETTYPRINT_REGULAR = True


class DevConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(basedir, "app.db")
    DEBUG = True


class ProductionConfig(BaseConfig):
    pyanywhere_username = os.environ.get("PYANYWHERE_USERNAME")
    pyanywhere_mysql_password = os.environ.get("PYANYWHERE_MYSQL_PASSWORD")
    pyanywhere_mysql_hostname = os.environ.get("PYANYWHERE_MYSQL_HOSTNAME")
    pyanywhere_mysql_dbname = os.environ.get("PYANYWHERE_MYSQL_DBNAME")

    SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://{username}:{password}@{hostname}/{databasename}".format(
        username=pyanywhere_username,
        password=pyanywhere_mysql_password,
        hostname=pyanywhere_mysql_hostname,
        databasename=pyanywhere_mysql_dbname,
    )

    DEBUG = False

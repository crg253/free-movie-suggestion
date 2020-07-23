import os

basedir = os.path.abspath(os.path.dirname(__file__))


class DevConfig(object):
    DEBUG = True

    JSONIFY_PRETTYPRINT_REGULAR = True

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(basedir, "app.db")
    SQLALCHEMY_POOL_RECYCLE = 299

    EMAIL_CONFIRM_SALT = os.environ.get("EMAIL_CONFIRM_SALT")
    SECRET_KEY = os.environ.get("SECRET_KEY")

    MAIL_PORT = 465
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True
    MAIL_SERVER = os.environ.get("MAIL_SERVER")
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")


class ProductionConfig(object):
    DEBUG = False

    JSONIFY_PRETTYPRINT_REGULAR = True

    SQLALCHEMY_TRACK_MODIFICATIONS = False

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

    SQLALCHEMY_POOL_RECYCLE = 299

    EMAIL_CONFIRM_SALT = os.environ.get("EMAIL_CONFIRM_SALT")
    SECRET_KEY = os.environ.get("SECRET_KEY")

    MAIL_PORT = 465
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True
    MAIL_SERVER = os.environ.get("MAIL_SERVER")
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")

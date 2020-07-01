from flask import Flask
from config import ProductionConfig, DevConfig
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_mail import Mail

db = SQLAlchemy()
migrate = Migrate()
mail = Mail()


def create_app(config_class=DevConfig):

    app = Flask(
        __name__,
        static_folder="../react-frontend/build/static",
        template_folder="../react-frontend/build",
    )

    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)

    from app.main import bp as main_bp

    app.register_blueprint(main_bp)

    from app.api import bp as api_bp

    app.register_blueprint(api_bp, url_prefix="/api")

    return app


from app import models

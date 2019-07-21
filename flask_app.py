from app import create_app, db

# from app import cli
from app.models import Movie, Tag, User

app = create_app()
# cli.register(app)


@app.shell_context_processor
def make_shell_context():
    return {"db": db, "Movie": Movie, "Tag": Tag, "User": User}

from flask import render_template
from app.main import bp

@bp.route('/', defaults={'path': ''})
@bp.route('/<path:path>')
def catch_all(path):
    return ('Change to render_template index')
    #return render_template('index.html')

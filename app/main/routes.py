from flask import render_template
from app.main import bp


@bp.route("/completeregistration/<email_token>")
def confirm_email(email_token):
    return render_template("index.html")


@bp.route("/completeresetpassword/<email_token>")
def complete_reset_password(email_token):
    return render_template("index.html")


@bp.route("/", defaults={"path": ""})
@bp.route("/<path:path>")
def catch_all(path):
    return render_template("index.html")

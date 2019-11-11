from wtforms import Form, PasswordField, StringField, validators


class CreateAccountForm(Form):
    name = StringField("name", [validators.Length(min=1)])
    email = StringField("email")
    password = PasswordField("password", [validators.Length(min=6)])

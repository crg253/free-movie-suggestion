from wtforms import Form, PasswordField, StringField, validators


class CreateAccountForm(Form):
    name = StringField("name", [validators.Length(min=1)])
    email = StringField("email")
    password = PasswordField("password", [validators.Length(min=6)])


class SignInForm(Form):
    name = StringField("name", [validators.Length(min=1)])
    password = PasswordField("password", [validators.Length(min=6)])


class TokenForm(Form):
    token = StringField("token")


class ResetPasswordForm(Form):
    email = StringField("email")


class ChangeNameForm(Form):
    name = StringField("name", [validators.Length(min=1)])


class ChangeEmailForm(Form):
    email = StringField("email", [validators.Length(min=1)])


class ChangePasswordForm(Form):
    password = PasswordField("password", [validators.Length(min=6)])


class SuggestMovieForm(Form):
    title = StringField("title", [validators.Length(min=1)])
    year = StringField("year", [validators.Length(min=4, max=4)])


class RemoveSuggestionForm(Form):
    slug = StringField("slug")


class SaveMovieForm(Form):
    slug = StringField("slug")

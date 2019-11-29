from wtforms import Form, PasswordField, StringField, validators, ValidationError


def name_type_and_length_check(form, field):
    if type(field.data) != str:
        raise ValidationError()
    if len(field.data) == 0:
        raise ValidationError()


class CreateAccountForm(Form):
    name = StringField("name", [name_type_and_length_check])
    email = StringField("email")
    password = PasswordField("password")


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


class UnsaveMovieForm(Form):
    slug = StringField("slug")

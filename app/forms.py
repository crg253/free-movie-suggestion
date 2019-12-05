from wtforms import Form, PasswordField, StringField, validators, ValidationError


def string_type_check(form, field):
    if type(field.data) != str:
        raise ValidationError()


def string_type_some_length_check(form, field):
    if type(field.data) != str:
        raise ValidationError()
    if len(field.data) == 0:
        raise ValidationError()


def string_type_password_length_check(form, field):
    if type(field.data) != str:
        raise ValidationError()
    if len(field.data) < 6:
        raise ValidationError()


class CreateAccountForm(Form):
    name = StringField("name", [string_type_some_length_check])
    email = StringField("email", [string_type_check])
    password = PasswordField("password", [string_type_password_length_check])


class SignInForm(Form):
    name = StringField("name", [string_type_some_length_check])
    password = PasswordField("password", [string_type_password_length_check])


class TokenForm(Form):
    token = StringField("token", [string_type_check])


class ResetPasswordForm(Form):
    email = StringField("email")


class ChangeNameForm(Form):
    name = StringField("name", [string_type_some_length_check])


class ChangeEmailForm(Form):
    email = StringField("email", [string_type_some_length_check])


class ChangePasswordForm(Form):
    password = PasswordField("password", [string_type_password_length_check])


class SuggestMovieForm(Form):
    title = StringField("title", [validators.Length(min=1)])
    year = StringField("year", [validators.Length(min=4, max=4)])


class RemoveSuggestionForm(Form):
    slug = StringField("slug")


class SaveMovieForm(Form):
    slug = StringField("slug")


class UnsaveMovieForm(Form):
    slug = StringField("slug")

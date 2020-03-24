from wtforms import Form, PasswordField, StringField, validators, ValidationError


def string_type_check(form, field):
    if type(field.data) != str:
        raise ValidationError()


def string_type_some_length_check(form, field):
    if type(field.data) != str:
        raise ValidationError()
    if len(field.data) == 0:
        raise ValidationError()


def string_type_length_4_check(form, field):
    if type(field.data) != str:
        raise ValidationError()
    if len(field.data) != 4:
        raise ValidationError()


def string_type_password_length_check(form, field):
    if type(field.data) != str:
        raise ValidationError()
    if len(field.data) < 6:
        raise ValidationError()


class CreateAccountForm(Form):
    name = StringField("name", [string_type_some_length_check])
    email = StringField("email", [string_type_some_length_check, validators.Email()])
    password = PasswordField("password", [string_type_password_length_check])


class SignInForm(Form):
    name = StringField("name", [string_type_some_length_check])
    password = PasswordField("password", [string_type_password_length_check])


class ResetPasswordForm(Form):
    email = StringField("email", [string_type_some_length_check, validators.Email()])
    password = PasswordField("password", [string_type_password_length_check])


class TokenForm(Form):
    token = StringField("token", [string_type_check])


class CheckEmailForm(Form):
    email = StringField("email", [string_type_some_length_check])


class ChangeNameForm(Form):
    name = StringField("name", [string_type_some_length_check])


class ChangeEmailForm(Form):
    email = StringField("email", [string_type_some_length_check])


class ChangePasswordForm(Form):
    password = PasswordField("password", [string_type_password_length_check])


class SaveMovieForm(Form):
    slug = StringField("slug", [string_type_some_length_check])


class UnsaveMovieForm(Form):
    slug = StringField("slug", [string_type_some_length_check])


class SuggestMovieForm(Form):
    title = StringField("title", [string_type_some_length_check])
    year = StringField("year", [string_type_length_4_check])


class RemoveSuggestionForm(Form):
    slug = StringField("slug", [string_type_some_length_check])

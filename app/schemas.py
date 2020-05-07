from marshmallow import fields, Schema, validate


class EmailSchema(Schema):
    email = fields.Email(required=True)


class NameSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1))


class PasswordSchema(Schema):
    password = fields.Str(required=True, validate=validate.Length(min=6))


class SlugSchema(Schema):
    slug = fields.Str(required=True, validate=validate.Length(min=5))


class UserSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))


class ResetPasswordSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))


class MovieSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(min=1))
    year = fields.Str(required=True, validate=validate.Length(min=4))

from marshmallow import fields, Schema, validate


class EmailSchema(Schema):
    email = fields.Email(required=True)


class NameSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1))


class PasswordSchema(Schema):
    password = fields.Str(required=True, validate=validate.Length(min=6))


class UserSchema(Schema):
    name = fields.Nested(NameSchema())
    email = fields.Nested(EmailSchema())
    password = fields.Nested(PasswordSchema())


class ResetPasswordSchema(Schema):
    email = fields.Nested(EmailSchema())
    password = fields.Nested(PasswordSchema())

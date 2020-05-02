from marshmallow import fields, Schema, validate


class EmailSchema(Schema):
    email = fields.Email(required=True)


class NewUserSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))

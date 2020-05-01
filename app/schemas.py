from marshmallow import fields, Schema

class EmailSchema(Schema):
    email = fields.Email(required=True)

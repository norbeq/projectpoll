from .model import db
import datetime

class Authentication(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token_uuid = db.Column(db.String(128), unique=True)
    type = db.Column(db.String(16))
    salt = db.Column(db.String(64))
    is_valid = db.Column(db.String(10))
    created = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __init__(self, user_id, salt, type, token_uuid = None, is_valid = True):
        self.user_id = user_id
        self.salt = salt
        self.type = type
        self.token_uuid = token_uuid
        self.is_valid = is_valid

from .model import db
from sqlalchemy import Enum
import datetime
import uuid

class Form(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    description = db.Column(db.TEXT)
    order = db.Column(Enum("random", "position"))
    form_uuid = db.Column(db.String(32), unique=True)
    created_date = db.Column(db.DateTime, default=datetime.datetime.now)
    active = db.Column(db.BOOLEAN, default=False)
    password_restriction = db.Column(db.BOOLEAN, default=False)
    password = db.Column(db.String(128))
    deleted = db.Column(db.BOOLEAN, default=False)
    cookie_restriction = db.Column(db.BOOLEAN, default=False)
    ip_address_restriction = db.Column(db.BOOLEAN, default=False)
    ip_address = db.Column(db.String(15))
    completed = db.Column(db.BOOLEAN, default=False)
    complete_date = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __init__(self, name, description, user_id = None, order = "random", password_restriction = False, password = None, cookie_restriction = False, ip_address_restriction = False, ip_address = None):
        self.name = name
        self.description = description
        self.form_uuid = str(uuid.uuid4())
        self.user_id = user_id
        self.order = order
        self.password_restriction = password_restriction
        self.password = password
        self.cookie_restriction = cookie_restriction
        self.ip_address_restriction = ip_address_restriction
        self.ip_address = ip_address
        self.active = False
        self.completed = False
        self.complete_date = None

    def set(self, body):
        for attr, val in body.items():
            self.__setattr__(attr, val)
# import sys
# class User:
#     users = {}
#     def __init__(self, id, is_authenticated):
#         self.is_authenticated = is_authenticated
#         self.is_active = False
#         self.is_anonymous = False
#         self.id = id
#         User.users[id] = self
#
#     def get_id(self):
#         return unicode(self.id)
#
#     def get(self):
#         return self
#
#     @classmethod
#     def find_logged_in(cls, user_id):
#         if(user_id in cls.users):
#             return cls.users[user_id]
#         return None


from .model import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), unique=True)
    password = db.Column(db.String(128))
    firstname = db.Column(db.String(45))
    lastname = db.Column(db.String(45))
    username = db.Column(db.String(64))
    authentication = db.relationship('Authentication', backref='user',lazy='dynamic')


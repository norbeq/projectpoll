from .model import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), unique=True)
    password = db.Column(db.String(128))
    firstname = db.Column(db.String(45))
    lastname = db.Column(db.String(45))
    username = db.Column(db.String(64))
    email_activation_key = db.Column(db.String(64))
    active = db.Column(db.BOOLEAN, default=False)
    authentication = db.relationship('Authentication', backref='user',lazy='dynamic')

    def __init__(self, email, password, username = None, firstname = None, lastname = None, email_activation_key = None, active = False):
        self.email = email
        self.password = password
        self.username = username
        self.firstname = firstname
        self.lastname = lastname
        self.email_activation_key = email_activation_key
        self.active = active
from .model import db

class FormQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(45), nullable=False)
    description = db.Column(db.TEXT)
    image = db.Column(db.String(64))
    type = db.Column(db.String(45), nullable=False)
    position = db.Column(db.INTEGER)
    form_id = db.Column(db.Integer, db.ForeignKey('form.id'), nullable=False)


    def set(self, body):
        for attr, val in body.items():
            self.__setattr__(attr, val)
from .model import db

class FormQuestionAnswer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(45), nullable=False)
    form_question_id = db.Column(db.Integer, db.ForeignKey('form_question.id'), nullable=False)

    def set(self, body):
        for attr, val in body.items():
            self.__setattr__(attr, val)
from .model import db

class RespondentVote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    custom_answer = db.Column(db.String(45))
    form_question_answer_id = db.Column(db.Integer, db.ForeignKey('form_question_answer.id'))
    form_question_id = db.Column(db.Integer, db.ForeignKey('form_question.id'), nullable=False)
    form_id = db.Column(db.Integer, db.ForeignKey('form.id'), nullable=False)
    respondent_id = db.Column(db.Integer, db.ForeignKey('respondent.id'), nullable=False)

    def __init__(self, respondent_id, form_question_id, form_id, custom_answer=None, form_question_answer_id=None):
        self.respondent_id = respondent_id
        self.form_question_id = form_question_id
        self.form_id = form_id
        self.custom_answer = custom_answer
        self.form_question_answer_id = form_question_answer_id
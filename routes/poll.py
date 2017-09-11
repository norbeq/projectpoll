from flask import Blueprint, session, request
from model.form import Form
from model.form_question import FormQuestion
from model.respondent import Respondent
from model.user import User
from util.http_response import JsonResponse, AuthenticationFailureResponse
from sqlalchemy import func
from model.model import db
poll_api = Blueprint('poll_api', __name__)
from util.auth import authentication

@poll_api.route('/poll/info', methods=['GET'])
def poll_info():
    forms = db.session.execute(
        db.session.query(Form).statement.with_only_columns([func.count()]).order_by(None)
    ).scalar()

    forms_completed = db.session.execute(
        db.session
            .query(Form)
            .filter_by(completed=True)
            .statement.with_only_columns([func.count()]).order_by(None)
    ).scalar()

    questions = db.session.execute(
        db.session.query(FormQuestion).statement.with_only_columns([func.count()]).order_by(None)
    ).scalar()

    respondents = db.session.execute(
        db.session.query(Respondent).statement.with_only_columns([func.count()]).order_by(None)
    ).scalar()

    users = db.session.execute(
        db.session.query(User).statement.with_only_columns([func.count()]).order_by(None)
    ).scalar()

    data = {"success": True, "data": {"forms": forms, "forms_completed": forms_completed, "questions": questions,
                                      "respondents": respondents, "users": users}}
    return JsonResponse(data)

@poll_api.route('/poll/<int:id>/', methods=['GET'])
@poll_api.route('/poll/<int:id>', methods=['GET'])
def poll_i(id):
    if authentication(request) == False:
        return AuthenticationFailureResponse()

    data = {"success": True, "message": "sa dane", "id": id}
    return JsonResponse(data)

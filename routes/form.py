from flask import Blueprint, request
from model.form import Form
from model.form_question import FormQuestion
from model.form_question_answer import FormQuestionAnswer
from model.respondent_vote import RespondentVote
from model.model import db
from util.http_response import JsonResponse, AuthenticationFailureResponse, BadRequestResponse
from sqlalchemy import text, func

form_api = Blueprint('form_api', __name__)
from util.auth import authentication


@form_api.route('/form', methods=['GET'])
def poll_info():
    token = authentication(request)
    if token == False:
        return AuthenticationFailureResponse()
    forms_result = Form.query.filter_by(user_id=token['id'], deleted=False)

    forms = []
    for form in forms_result:
        f = {}
        f['id'] = form.id
        f['order'] = form.order
        f['name'] = form.name
        f['description'] = form.description
        f['form_uuid'] = form.form_uuid
        f['created_date'] = str(form.created_date)
        f['active'] = form.active
        f['password_restriction'] = form.password_restriction
        f['password'] = form.password
        f['deleted'] = form.deleted
        f['cookie_restriction'] = form.cookie_restriction
        f['ip_address_restriction'] = form.ip_address_restriction
        f['ip_address'] = form.ip_address
        f['completed'] = form.completed
        if form.complete_date is not None:
            f['complete_date'] = str(form.complete_date)
        else:
            f['complete_date'] = None
        f['completion_notify'] = form.completion_notify
        forms.append(f)

    data = {"success": True, "data": forms}
    return JsonResponse(data)


@form_api.route('/form', methods=['POST'])
def poll_create():
    token = authentication(request)
    if token == False:
        return AuthenticationFailureResponse()

    try:
        body = request.get_json()
    except:
        return BadRequestResponse({"success": False, "message": "Wrong json"})

    form = Form(name=body.get('name'), description=body.get('description'), user_id=token['id'],
                order=body.get('order', 'random'),
                password_restriction=body.get('password_restriction', False), password=body.get('password', None),
                cookie_restriction=body.get('cookie_restriction', False),
                ip_address_restriction=body.get('ip_address_restriction', False),
                ip_address=body.get('ip_address', None),
                completion_notify=body.get("completion_notify", False))

    db.session.add(form)
    db.session.commit()
    form_val = {"id": form.id, "name": form.name, "description": form.description, "order": form.order,
                "password_restriction": form.password_restriction,
                "password": form.password, "cookie_restriction": form.cookie_restriction,
                "ip_address_restriction": form.ip_address_restriction, "ip_address": form.ip_address,
                "form_uuid": form.form_uuid, "created_date": str(form.created_date), "active": form.active,
                "deleted": form.deleted, "completed": form.completed, "complete_date": form.complete_date, "completion_notify": form.completion_notify}
    data = {"success": True, "data": form_val}

    return JsonResponse(data)


@form_api.route('/form/<int:form_id>', methods=['PUT'])
def poll_update(form_id):
    token = authentication(request)
    if token == False:
        return AuthenticationFailureResponse()

    try:
        body = request.get_json()
    except:
        return BadRequestResponse({"success": False, "message": "Wrong json"})

    form = Form.query.filter_by(id=form_id, user_id=token['id']).first()
    if not form:
        return BadRequestResponse(obj={"success": False})

    form.set(body)
    db.session.commit()
    form_val = {"id": form.id, "name": form.name, "description": form.description, "order": form.order,
                "password_restriction": form.password_restriction,
                "password": form.password, "cookie_restriction": form.cookie_restriction,
                "ip_address_restriction": form.ip_address_restriction, "ip_address": form.ip_address,
                "form_uuid": form.form_uuid, "created_date": str(form.created_date), "active": form.active,
                "deleted": form.deleted, "completed": form.completed, "complete_date": form.complete_date, "completion_notify": form.completion_notify}
    data = {"success": True, "data": form_val}

    return JsonResponse(data)


@form_api.route('/form/<int:form_id>', methods=['DELETE'])
def poll_delete(form_id):
    token = authentication(request)
    if token == False:
        return AuthenticationFailureResponse()

    form = Form.query.filter_by(id=form_id, user_id=token['id'], deleted=False).first()
    if not form:
        return BadRequestResponse(obj={"success": False})

    form.deleted = True
    db.session.commit()
    data = {"success": True}

    return JsonResponse(data)


@form_api.route('/form/<int:form_id>/question', methods=['GET'])
def form_questions(form_id):
    token = authentication(request)
    if token == False:
        return AuthenticationFailureResponse()

    form = Form.query.filter_by(id=form_id, user_id=token['id'], deleted=False).first()
    if not form:
        return BadRequestResponse(obj={"success": False})

    questions_result = FormQuestion.query.filter_by(form_id=form_id)

    questions = []
    for q in questions_result:
        f = {}
        f['id'] = q.id
        f['name'] = q.name
        f['description'] = q.description
        f['type'] = q.type
        f['position'] = q.position
        f['form_id'] = form_id
        questions.append(f)

    data = {"success": True, "data": questions}
    return JsonResponse(data)


@form_api.route('/form/<int:form_id>/question/<int:question_id>', methods=['DELETE'])
def question_delete(form_id, question_id):
    token = authentication(request)
    if token == False:
        return AuthenticationFailureResponse()

    form = Form.query.filter_by(id=form_id, user_id=token['id'], deleted=False).first()
    if not form:
        return BadRequestResponse(obj={"success": False})

    question = FormQuestion.query.filter_by(id=question_id, form_id=form_id).first()

    db.session.delete(question)
    db.session.commit()
    data = {"success": True}

    return JsonResponse(data)


@form_api.route('/form/<int:form_id>/question', methods=['POST'])
def question_create(form_id):
    token = authentication(request)
    if token == False:
        return AuthenticationFailureResponse()

    try:
        body = request.get_json()
    except:
        return BadRequestResponse({"success": False, "message": "Wrong json"})

    body['form_id'] = form_id

    question = FormQuestion()
    question.set(body)

    db.session.add(question)
    db.session.commit()
    form_val = {"id": question.id, "name": question.name, "description": question.description, "type": question.type,
                "position": question.position, "form_id": form_id}
    data = {"success": True, "data": form_val}

    return JsonResponse(data)


@form_api.route('/form/<int:form_id>/question/<int:question_id>/answer', methods=['GET'])
def question_answer_read(form_id, question_id):
    token = authentication(request)
    if token == False:
        return AuthenticationFailureResponse()

    form = Form.query.filter_by(id=form_id, user_id=token['id'], deleted=False).first()
    if not form:
        return BadRequestResponse(obj={"success": False})

    answer_result = FormQuestionAnswer.query.filter_by(form_question_id=question_id)

    answers = []
    for q in answer_result:
        f = {}
        f['id'] = q.id
        f['name'] = q.name
        answers.append(f)

    data = {"success": True, "data": answers}
    return JsonResponse(data)


@form_api.route('/form/<int:form_id>/question/<int:question_id>/answer/<int:question_answer_id>', methods=['DELETE'])
def question_answer_delete(form_id, question_id, question_answer_id):
    token = authentication(request)
    if token == False:
        return AuthenticationFailureResponse()

    form = Form.query.filter_by(id=form_id, user_id=token['id'], deleted=False).first()
    if not form:
        return BadRequestResponse(obj={"success": False})

    question = FormQuestionAnswer.query.filter_by(id=question_answer_id, form_question_id=question_id).first()

    db.session.delete(question)
    db.session.commit()
    data = {"success": True}

    return JsonResponse(data)


@form_api.route('/form/<int:form_id>/question/<int:question_id>/answer', methods=['POST'])
def question_answer_create(form_id, question_id):
    token = authentication(request)
    if token == False:
        return AuthenticationFailureResponse()

    try:
        body = request.get_json()
    except:
        return BadRequestResponse({"success": False, "message": "Wrong json"})

    form = Form.query.filter_by(id=form_id, user_id=token['id'], deleted=False).first()
    if not form:
        return BadRequestResponse(obj={"success": False})

    body['form_question_id'] = question_id

    question_answer = FormQuestionAnswer()
    question_answer.set(body)

    db.session.add(question_answer)
    db.session.commit()
    form_val = {"id": question_answer.id, "name": question_answer.name}
    data = {"success": True, "data": form_val}

    return JsonResponse(data)


@form_api.route('/form/<int:form_id>/votes', methods=['GET'])
def form_votes(form_id):
    token = authentication(request)
    if token == False:
        return AuthenticationFailureResponse()

    form = Form.query.filter_by(id=form_id, user_id=token['id'], deleted=False).first()
    if not form:
        return BadRequestResponse(obj={"success": False})

    query = db.session.query(
        RespondentVote.custom_answer,
        RespondentVote.form_question_answer_id,
        RespondentVote.form_question_id,
        func.count(RespondentVote.form_question_answer_id).label('count')
    ).filter_by(form_id=form_id).group_by(RespondentVote.form_question_id).group_by(RespondentVote.form_question_answer_id)

    questions_result = FormQuestion.query.filter_by(form_id=form_id)

    questions = {}
    for q in questions_result:
        f = {}
        f['id'] = q.id
        f['name'] = q.name
        f['description'] = q.description
        f['type'] = q.type
        f['position'] = q.position

        if q.type == "select":
            answer_result = FormQuestionAnswer.query.filter_by(form_question_id=q.id)

            f['answers'] = {}
            for o in answer_result:
                p = {}
                p['id'] = o.id
                p['name'] = o.name
                f['answers'][o.id] = p


        questions[q.id] = f

    question_answers_grouped = []
    for row in query:
        res = {}
        res['custom_answer'] = row.custom_answer
        res['form_question_answer_id'] = row.form_question_answer_id
        res['form_question_id'] = row.form_question_id

        if row.form_question_id in questions:
            res['form_question_name'] = questions[row.form_question_id]['name']
            if questions[row.form_question_id]['type'] == "select" and row.form_question_answer_id in questions[row.form_question_id]['answers']:
                res['answer'] = questions[row.form_question_id]['answers'][row.form_question_answer_id]['name']


        res['count'] = row.count
        question_answers_grouped.append(res)

    # respondent_votes = (db.session.query(RespondentVote, FormQuestionAnswer, FormQuestion).join(FormQuestionAnswer).join(FormQuestion).filter(RespondentVote.form_id == form_id)).all()
        # RespondentVote.query.join(FormQuestionAnswer, RespondentVote.form_question_answer_id==FormQuestionAnswer.id).\
        # add_columns(FormQuestionAnswer.name).join(FormQuestion, RespondentVote.form_question_id==FormQuestion.id).add_columns(FormQuestion.name).filter(RespondentVote.form_id == form_id)

    respondent_votes = RespondentVote.query.join(FormQuestionAnswer, RespondentVote.form_question_answer_id==FormQuestionAnswer.id).add_columns(FormQuestionAnswer.name).join(FormQuestion, RespondentVote.form_question_id==FormQuestion.id).add_columns(FormQuestion.name).filter(RespondentVote.form_id == form_id).all()
    respondents = {}
    # print(respondent_votes)
    for p in respondent_votes:
        q = p[0]

        if not q.respondent_id in respondents:
            respondents[q.respondent_id] = {}

        if not 'answers' in respondents[q.respondent_id]:
            respondents[q.respondent_id]['answers'] = {}

        if q.form_question_id in questions:

            qes = questions[q.form_question_id]
            if qes['type'] == "custom":
                respondents[q.respondent_id]['answers'][p[2]] = q.custom_answer
            else:
                respondents[q.respondent_id]['answers'][p[2]] = p[1]

    for res in respondents:
        if len(respondents[res]['answers']) == len(questions):
            respondents[res]['completed'] = True
        else:
            respondents[res]['completed'] = False

    data = {"success": True, "questions": questions, "respondents": respondents, "question_answers_grouped": question_answers_grouped}
    return JsonResponse(data)
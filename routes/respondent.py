from flask import Blueprint, session, request, current_app as app
from model.respondent import Respondent
from model.form import Form
from model.form_question import FormQuestion
from model.form_question_answer import FormQuestionAnswer
from model.respondent_vote import RespondentVote
from util.http_response import JsonResponse, BadRequestResponse
from sqlalchemy import func
from model.model import db
from sqlalchemy import text
import datetime
import math
from flask_socketio import emit

respondent_api = Blueprint('respondent_api', __name__)


@respondent_api.route('/respondent/info', methods=['GET'])
def poll_info():
    query = db.session.query(
        Respondent.os_platform,
        Respondent.user_agent,
        func.count(Respondent.user_agent).label('count')
    ).group_by(Respondent.os_platform)

    data = []
    for row in query:
        res = {}
        res['os_platform'] = row.os_platform
        res['count'] = row.count
        data.append(res)

    data = {"success": True, "data": data}
    return JsonResponse(data)


@respondent_api.route('/respondent/start', methods=['POST'])
def respondent_start():
    try:
        body = request.get_json()
    except:
        return BadRequestResponse({"success": False, "message": "Wrong json"})

    form_uuid = body.get('form_uuid')
    if not form_uuid:
        return BadRequestResponse({"success": False, "message": "Form uuid required"})

    form = Form.query.filter_by(form_uuid=form_uuid, active=True, deleted=False).first()
    if not form:
        return BadRequestResponse(obj={"success": False})

    respondent = Respondent(form_id=form.id)
    respondent.os_platform = request.user_agent.platform
    respondent.user_agent = request.user_agent.browser
    respondent.ip_address = request.remote_addr

    db.session.add(respondent)
    db.session.commit()
    res_data = {"guest_uuid": respondent.guest_uuid}
    data = {"success": True, "data": res_data}

    return JsonResponse(data)


@respondent_api.route('/respondent/question/<guest_uuid>', methods=['GET'])
def respondent_question(guest_uuid):
    respondent = Respondent.query.filter_by(guest_uuid=guest_uuid).first()
    if not respondent:
        return BadRequestResponse(obj={"success": False})

    form = Form.query.filter_by(id=respondent.form_id, active=True, deleted=False).first()
    if not form:
        return BadRequestResponse(obj={"success": False})

    if form.order == "position":
        sql = text('select fq.id, fq.name, fq.description, fq.type from form_question fq WHERE id not in (select form_question_id from respondent_vote rv join respondent r ON r.id=rv.respondent_id WHERE r.guest_uuid=:uuid) AND fq.id in (select form_question_id from form_question_answer) ORDER BY fq.position ASC limit 1')
    else:
        sql = text('select fq.id, fq.name, fq.description, fq.type from form_question fq WHERE id not in (select form_question_id from respondent_vote rv join respondent r ON r.id=rv.respondent_id WHERE r.guest_uuid=:uuid) AND fq.id in (select form_question_id from form_question_answer) ORDER BY rand() ASC limit 1')
    result = db.engine.execute(sql, {'uuid': guest_uuid}).fetchone()

    if result:
        data = {"success": True,
                "data": {"id": result[0], "name": result[1], "description": result[2], "type": result[3]}}

        sql_answers = text(
            'select fqa.id, fqa.name from form_question_answer fqa WHERE fqa.form_question_id=:id')
        res_answers = db.engine.execute(sql_answers, {'id': result[0]})

        answers = []
        for a in res_answers:
            answer = {}
            answer['id'] = a[0]
            answer['name'] = a[1]
            answers.append(answer)

        data['data']['answers'] = answers

        return JsonResponse(data)
    else:
        now = datetime.datetime.now()
        respondent.end_date = str(now.strftime("%Y-%m-%d %H:%M:%S"))
        db.session.commit()

        data = {"success": True, "data": None}
        return JsonResponse(data)


@respondent_api.route('/respondent/question/<guest_uuid>/vote', methods=['POST'])
def respondent_question_vote(guest_uuid):
    try:
        body = request.get_json()
    except:
        return BadRequestResponse({"success": False, "message": "Wrong json"})

    if not body.get('answer') or not body.get('question_id'):
        return BadRequestResponse({"success": False, "message": "Answer and question is required"})

    respondent = Respondent.query.filter_by(guest_uuid=guest_uuid).first()
    if not respondent:
        return BadRequestResponse(obj={"success": False})

    form = Form.query.filter_by(id=respondent.form_id, active=True, deleted=False).first()
    if not form:
        return BadRequestResponse(obj={"success": False})

    respondent_vote = RespondentVote(respondent.id, body.get('question_id'), form.id, custom_answer=None,
                                     form_question_answer_id=body.get('answer'))

    db.session.add(respondent_vote)
    db.session.commit()

    if form.user_id in app.sockets:
        emit('vote', {'question_id': body.get('question_id'), 'form_id': form.id,
                      'form_question_answer_id': body.get('answer')}, namespace="/", room=app.sockets[form.user_id])

    data = {"success": True}
    return JsonResponse(data)
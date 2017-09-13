from flask import Blueprint, request, current_app as app
from model.user import User
from model.authentication import Authentication
from model.model import db
import uuid
import hashlib
from jose import jwt
import datetime
from util.http_response import ForbiddenResponse, JsonResponse, BadRequestResponse, AuthenticationFailureResponse, InternalServerErrorResponse
from util.auth import authentication
import random

login_api = Blueprint('login_api', __name__)

@login_api.route('/login', methods=['POST'])
def login():
    try:
        body = request.get_json()
    except:
        return BadRequestResponse({"success": False, "message": "Wrong json"})

    email = body.get('email')
    digest = body.get('digest')

    user = User.query.filter_by(email=email, active=True).first()
    if user is None:
        return ForbiddenResponse(obj={"success": False})

    last_authentication = Authentication.query.filter_by(user_id=user.id,type="salt",is_valid=True).order_by(Authentication.created.desc()).first()
    if not last_authentication:
        return ForbiddenResponse(obj={"success": False})

    correct_password = hashlib.sha512((str(user.password)+":"+str(last_authentication.salt)).encode('utf-8')).hexdigest()

    if digest != correct_password:
        return ForbiddenResponse(obj={"success": False})

    token_uuid = uuid.uuid4()
    last_authentication.type = "token"
    last_authentication.token_uuid = token_uuid
    db.session.commit()

    Authentication.query.filter_by(user_id=user.id, type="salt").update({"is_valid":False})
    db.session.commit()

    token_payload = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'token_uuid': str(token_uuid),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=app.config['token']['expiration_seconds']),
        'iss': app.config['token']['iss']
    }

    token = jwt.encode(token_payload, app.config['token']['key'], algorithm='HS256')

    data = {"success": True, "token": str(token)}
    return JsonResponse(data)

@login_api.route('/pre_login', methods=['POST'])
def pre_login():
    try:
        body = request.get_json()
    except:
        return BadRequestResponse({"success": False, "message": "Wrong json"})

    salt = "".join(random.choice('0123456789ABCDEFGHIJKLMNOPRSTUVWXYZabcdefghijklmnoprstuvwxyz') for i in range(64))
    email = body.get('email')
    user = User.query.filter_by(email=email).first()

    if user is None:
        return ForbiddenResponse(obj={"success": False})

    try:
        authentication = Authentication(user.id, salt, 'salt')
        db.session.add(authentication)
        db.session.commit()
    except:
        return InternalServerErrorResponse()

    data = {"success": True, "salt": salt}
    return JsonResponse(data)

@login_api.route('/check_token', methods=['GET'])
def check_token():
    if authentication(request) == False:
        return AuthenticationFailureResponse()

    data = {"success": True}
    return JsonResponse(data)
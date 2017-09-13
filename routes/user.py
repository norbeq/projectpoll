from flask import Blueprint, request
from model.user import User
from util.auth import authentication
from model.model import db
from util.http_response import JsonResponse, BadRequestResponse, AuthenticationFailureResponse
from validate_email import validate_email
import hashlib

user_api = Blueprint('user_api', __name__)

@user_api.route('/user', methods=['GET'])
def user_get():
    token = authentication(request)
    if token == False:
        return AuthenticationFailureResponse()

    user = User.query.filter_by(id=token['id']).first()
    if not user:
        return BadRequestResponse(obj={"success": False})

    data = {}
    data['username'] = user.username
    data['email'] = user.email
    data['firstname'] = user.firstname
    data['lastname'] = user.lastname
    data['password'] = ""

    data = {"success": True, "data": data}

    return JsonResponse(data)

@user_api.route('/user', methods=['PUT'])
def user_put():
    token = authentication(request)
    if token == False:
        return AuthenticationFailureResponse()

    try:
        body = request.get_json()
    except:
        return BadRequestResponse({"success": False, "message": "Wrong json"})

    user = User.query.filter_by(id=token['id']).first()
    if not user:
        return BadRequestResponse(obj={"success": False})


    user.set(body)

    db.session.commit()
    data = {}
    data['username'] = user.username
    data['email'] = user.email
    data['firstname'] = user.firstname
    data['lastname'] = user.lastname
    data['password'] = ""

    data = {"success": True, "data": data}

    return JsonResponse(data)

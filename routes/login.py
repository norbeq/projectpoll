from flask import Blueprint, send_from_directory, request, json, Flask
from model.user import User
from model.authentication import Authentication
from model.model import db
import uuid
import hashlib

app = Flask(__name__)
login_api = Blueprint('login_api', __name__)

@login_api.route('/login', methods=['POST'])
def login():

    body = request.get_json()

    email = body.get('email')
    digest = body.get('digest')

    user = User.query.filter_by(email=email).first()
    if user is None:
        response = app.response_class(
            response=json.dumps({"success": False}),
            status=403,
            mimetype='application/json'
        )
        return response

    last_authentication = Authentication.query.filter_by(user_id=user.id,type="salt",is_valid=True).order_by(Authentication.created.desc()).first()
    correct_password = hashlib.sha512((str(user.password)+":"+str(last_authentication.salt)).encode('utf-8')).hexdigest()

    if digest != correct_password:
        response = app.response_class(
            response=json.dumps({"success": False}),
            status=403,
            mimetype='application/json'
        )
        return response

    token_uuid = uuid.uuid4()
    last_authentication.type = "token"
    last_authentication.token_uuid = token_uuid
    db.session.commit()

    Authentication.query.filter_by(user_id=user.id, type="salt").update({"is_valid":False})
    db.session.commit()

    data = {"success": True, "token": token_uuid}
    response = app.response_class(
        response=json.dumps(data),
        status=200,
        mimetype='application/json'
    )
    return response

@login_api.route('/pre_login', methods=['POST'])
def pre_login():
    body = request.get_json()
    salt = uuid.uuid4()
    email = body.get('email')
    user = User.query.filter_by(email=email).first()

    if user is not None:
        authentication = Authentication(user.id, salt, 'salt')
        db.session.add(authentication)
        db.session.commit()
    data = {"success": True, "salt": salt}

    response = app.response_class(
        response=json.dumps(data),
        status=200,
        mimetype='application/json'
    )
    return response
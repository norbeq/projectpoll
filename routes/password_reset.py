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
import uuid
import hashlib
from flask_mail import Mail, Message

password_reset_api = Blueprint('password_reset_api', __name__)

@password_reset_api.route('/reset', methods=['POST'])
def reset():
    try:
        body = request.get_json()
    except:
        return BadRequestResponse({"success": False, "message": "Wrong json"})

    email = body.get('email')

    user = User.query.filter_by(email=email, active=True).first()
    if user is None:
        return ForbiddenResponse(obj={"success": False})

    password = str(uuid.uuid4())[0:6]
    hashed_password = hashlib.sha512((str(password)).encode('utf-8')).hexdigest()
    user.password = hashed_password
    db.session.commit()

    mail = Mail(app)
    msg = Message('Resetowanie hasła w poll.mianor.pl',
                  sender=app.config['mail_conf']['sender'],
                  recipients=[user.email])

    msg.body = "Twoje nowe hasło to: \r\n {}".format(password)
    mail.send(msg)

    data = {"success": True}
    return JsonResponse(data)

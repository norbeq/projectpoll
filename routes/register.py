from flask import Blueprint, request, current_app as app
from model.user import User
from model.model import db
from util.http_response import JsonResponse, BadRequestResponse
from validate_email import validate_email
import hashlib
from flask_mail import Mail, Message
import uuid

register_api = Blueprint('register_api', __name__)


@register_api.route('/register', methods=['POST'])
def login():
    try:
        body = request.get_json()
    except:
        return BadRequestResponse({"success": False, "message": "Wrong json"})

    email = body.get('email')
    password = body.get('password')

    if not email or not password:
        return BadRequestResponse({"success": False, "message": "Email and password is required"})

    is_valid = validate_email(email)

    if not is_valid:
        return BadRequestResponse({"success": False, "message": "Email is not valid"})

    user_exists = User.query.filter_by(email=email).first()
    if user_exists:
        return BadRequestResponse({"success": False, "message": "Email is used"})

    firstname = body.get('firstname')
    lastname = body.get('lastname')
    username = body.get('username')
    activation_key = str(uuid.uuid4())

    user = User(email, hashlib.sha512((str(password)).encode('utf-8')).hexdigest(), username, firstname, lastname,
                activation_key)
    db.session.add(user)
    db.session.commit()

    mail = Mail(app)
    msg = Message('Rejestracja w serwisie poll.mianor.pl',
                  sender=app.config['mail_conf']['sender'],
                  recipients=[email])

    msg.body = "Dziękujemy za rejestrację w serwisie.\r\n Aby aktywować konto wejdź w poniższy link: \r\n {}/#activation/{}/{}".format(app.config['http_url'], activation_key, email)
    mail.send(msg)

    data = {"success": True}

    return JsonResponse(data)

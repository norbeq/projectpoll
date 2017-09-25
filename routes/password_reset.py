from flask import Blueprint, request, current_app as app
from model.user import User
from model.model import db
from util.http_response import ForbiddenResponse, JsonResponse, BadRequestResponse
import uuid
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
    user.password = password
    db.session.commit()

    mail = Mail(app)
    msg = Message('Resetowanie hasła w projekt-miazek.pl',
                  sender=app.config['mail_conf']['sender'],
                  recipients=[user.email])

    msg.body = "Twoje nowe hasło to: \r\n {}".format(password)
    mail.send(msg)

    data = {"success": True}
    return JsonResponse(data)

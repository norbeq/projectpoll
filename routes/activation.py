from flask import Blueprint, request
from model.user import User
from model.model import db
from util.http_response import JsonResponse, BadRequestResponse
from validate_email import validate_email

activation_api = Blueprint('activation_api', __name__)


@activation_api.route('/activation', methods=['POST'])
def login():
    try:
        body = request.get_json()
    except:
        return BadRequestResponse({"success": False, "message": "Wrong json"})

    email = body.get('email')
    activation_key = body.get('activation_key')

    if not email or not activation_key:
        return BadRequestResponse({"success": False, "message": "Email and activation key is required"})

    is_valid = validate_email(email)

    if not is_valid:
        return BadRequestResponse({"success": False, "message": "Email is not valid"})

    user = User.query.filter_by(email=email, active=False, email_activation_key = activation_key).first()
    if not user:
        return BadRequestResponse({"success": False, "message": "Email is not valid"})

    user.active = True
    user.email_activation_key = None

    db.session.commit()
    data = {"success": True}

    return JsonResponse(data)

from flask import Blueprint, send_from_directory


static_api = Blueprint('static_api', __name__)
@static_api.route('/<path:path>')
def send_js(path):
    return send_from_directory('static', path)
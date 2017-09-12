from flask import Blueprint, send_from_directory, send_file

static_api = Blueprint('static_api', __name__)


@static_api.route('/<path:path>')
def send_js(path):
    return send_from_directory('static', path)


@static_api.route('/')
def send_jso():
    return send_file("static/index.html")


@static_api.route('/upload/<path:path>')
def send_upload(path):
    return send_from_directory('upload', path)

from flask import Blueprint, send_from_directory, request, json, Flask


app = Flask(__name__)
login_api = Blueprint('login_api', __name__)
@login_api.route('/login', methods=['POST'])
def login():

    body = request.get_json()

    username = body.get('username')
    password = body.get('password')
    if(username != 'admin'):
        return "000"

    if(password != 'admin123'):
        return "999"

    data = {"success": True, "token": "Basic YWRtaW46YWRtaW4xMjM="}

    response = app.response_class(
        response=json.dumps(data),
        status=200,
        mimetype='application/json'
    )
    return response

@login_api.route('/pre_login/', methods=['POST'])
def pre_login():

    body = request.get_json()

    username = body.get('username')
    password = body.get('password')
    if(username != 'admin'):
        return "000"

    if(password != 'admin123'):
        return "999"

    data = {"success": True, "token": "Basic YWRtaW46YWRtaW4xMjM="}

    response = app.response_class(
        response=json.dumps(data),
        status=200,
        mimetype='application/json'
    )
    return response
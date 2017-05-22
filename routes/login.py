from flask import Blueprint, send_from_directory, request, json, Flask


app = Flask(__name__)
login_api = Blueprint('login_api', __name__)
@login_api.route('/login', methods=['POST'])
def login():
    username = request.values.get('username')
    password = request.values.get('password')
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
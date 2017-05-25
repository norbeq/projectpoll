from flask import Flask, render_template, request, send_from_directory, json
from flask_socketio import SocketIO
from flask_login import current_user, LoginManager, login_user
from model.user import User
from routes.static import static_api
from routes.login import login_api
import base64
from config import token

from util.middleware import AuthenticationMiddleware
import eventlet
eventlet.monkey_patch()

app = Flask(__name__, static_url_path='')
app.config['token'] = token

# app.wsgi_app = AuthenticationMiddleware(app.wsgi_app)
socketio = SocketIO(app)

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.request_loader
def load_user_from_request(request):
    # next, try to login using Basic Auth
    api_key = request.headers.get('Authorization')
    header_cookies = request.headers.get('Cookie')
    header_cookies = header_cookies.split('; ')
    cookies = {}

    for cookie in header_cookies:
        cookie = cookie.split('=')
        cookies[cookie[0]] = cookie[1]

    if('Authorization' in cookies):
        api_key = cookies['Authorization'].replace('Basic ', '', 1)
        try:
            api_key = base64.b64decode(api_key)
            print(api_key)
        except TypeError:
            pass
        user = User(10, True)
        if user:
            return user
    return None

@socketio.on('connect')
def connect_handler():
    if current_user.is_authenticated:
        print('aaa')
        return True
    else:
        print('not allowed')
        return False  # not allowed here

@socketio.on('messages')
def handle_message(message):
    print(message)

app.register_blueprint(login_api, url_prefix='/api')
app.register_blueprint(static_api, url_prefix='')

if __name__ == '__main__':
    socketio.run(app,'0.0.0.0',80, debug = True)

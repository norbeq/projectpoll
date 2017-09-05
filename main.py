from flask import Flask, render_template, request, send_from_directory, json
from flask_socketio import SocketIO
from flask_login import current_user, LoginManager, login_user
from routes.static import static_api
from routes.login import login_api
from routes.poll import poll_api
from routes.register import register_api
from routes.form import form_api
from routes.respondent import respondent_api
from routes.activation import activation_api
from model.model import db
from jose import jwt
import base64
from config import token, db_conf, mail_conf, http_url

import eventlet

eventlet.monkey_patch()

app = Flask(__name__, static_url_path='')
app.config['token'] = token
app.config['SQLALCHEMY_DATABASE_URI'] = db_conf
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['http_url'] = http_url
app.config['mail_conf'] = mail_conf

# (Debug=True, MAIL_SERVER=app.config['mail']['server'], MAIL_PORT=app.config['mail']['port'],
#                 MAIL_USE_SSL=app.config['mail']['use_ssl'], MAIL_USERNAME=app.config['mail']['username'],
#                 MAIL_PASSWORD=app.config['mail']['password'])

app.config.update(
    DEBUG=True,
    MAIL_SERVER=mail_conf['server'],
    MAIL_PORT=mail_conf['port'],
    MAIL_USE_SSL=mail_conf['use_ssl'],
    MAIL_USERNAME=mail_conf['username'],
    MAIL_PASSWORD=mail_conf['password']
)


socketio = SocketIO(app)


# login_manager = LoginManager()
# login_manager.init_app(app)
#
# @login_manager.request_loader
# def load_user_from_request(request):
#     # next, try to login using Basic Auth
#     api_key = request.headers.get('Authorization')
#     header_cookies = request.headers.get('Cookie')
#     header_cookies = header_cookies.split('; ')
#     cookies = {}
#
#     for cookie in header_cookies:
#         cookie = cookie.split('=')
#         cookies[cookie[0]] = cookie[1]
#
#     if('Authorization' in cookies):
#         api_key = cookies['Authorization'].replace('Basic ', '', 1)
#         try:
#             api_key = base64.b64decode(api_key)
#             print(api_key)
#         except TypeError:
#             pass
#         user = User(10, True)
#         if user:
#             return user
#     return None
#
@socketio.on('connect')
def connect_handler():
    if not 'auth' in request.cookies:
        return False

    try:
        decoded = jwt.decode(request.cookies['auth'], app.config['token']['key'], algorithms='HS256')
    except:
        return False

    return True


@socketio.on('messages')
def handle_message(message):
    print(message)


app.register_blueprint(form_api, url_prefix='/api')
app.register_blueprint(login_api, url_prefix='/api')
app.register_blueprint(register_api, url_prefix='/api')
app.register_blueprint(poll_api, url_prefix='/api')
app.register_blueprint(respondent_api, url_prefix='/api')
app.register_blueprint(activation_api, url_prefix='/api')
app.register_blueprint(static_api, url_prefix='')
db.init_app(app)

if __name__ == '__main__':
    socketio.run(app, '0.0.0.0', 80, debug=True)

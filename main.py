from flask import Flask, request
from flask_socketio import SocketIO
from routes.login import login_api
from routes.poll import poll_api
from routes.register import register_api
from routes.form import form_api
from routes.respondent import respondent_api
from routes.activation import activation_api
from routes.password_reset import password_reset_api
from routes.static import static_api
from model.model import db
from jose import jwt
from config import token, db_conf, mail_conf, http_url, upload

import eventlet

eventlet.monkey_patch()

app = Flask(__name__, static_url_path='')
app.config['token'] = token
app.config['SQLALCHEMY_DATABASE_URI'] = db_conf
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['http_url'] = http_url
app.config['mail_conf'] = mail_conf
app.sockets = {}

app.config.update(
    DEBUG=True,
    MAIL_SERVER=mail_conf['server'],
    MAIL_PORT=mail_conf['port'],
    MAIL_USE_SSL=mail_conf['use_ssl'],
    MAIL_USERNAME=mail_conf['username'],
    MAIL_PASSWORD=mail_conf['password'],
    UPLOAD_FOLDER=upload['folder'],
    ALLOWED_EXTENSIONS=upload['allowed_extensions']
)

socketio = SocketIO(app)

@socketio.on('connect')
def connect_handler():
    if not 'auth' in request.cookies:
        return False
    try:
        decoded = jwt.decode(request.cookies['auth'], app.config['token']['key'], algorithms='HS256')
    except:
        return False

    request.user_id = decoded["id"]
    app.sockets[decoded["id"]] = request.sid
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
app.register_blueprint(password_reset_api, url_prefix='/api')
app.register_blueprint(static_api, url_prefix='')
db.init_app(app)

if __name__ == '__main__':
    socketio.run(app, '0.0.0.0', 80, debug=True)

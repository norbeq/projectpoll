from flask import current_app as app
from jose import jwt

def authentication(request):
    auth = request.headers.get('auth')

    if not auth and not request.cookies.get('auth'):
        return False

    success = True
    decoded = None

    try:
        if auth:
            decoded = jwt.decode(auth, app.config['token']['key'], algorithms='HS256')
    except:
        success = False

    if success:
        return decoded

    try:
        if request.cookies.get('auth'):
            decoded = jwt.decode(request.cookies.get('auth'), app.config['token']['key'], algorithms='HS256')
    except:
        return False

    return decoded
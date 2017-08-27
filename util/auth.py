from flask import current_app as app
from jose import jwt

def authentication(request):
    auth = request.headers.get('auth')

    if not auth:
        return False

    try:
        decoded = jwt.decode(auth, app.config['token']['key'], algorithms='HS256')
    except:
        return False


    return decoded
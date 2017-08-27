from flask import json, Flask, current_app as app


def AuthenticationFailureResponse():
    return app.response_class(
        response=json.dumps({'message': 'Błąd tokenu autoryzacyjnego', 'success': False}),
        status=403,
        mimetype='application/json'
    );


def ForbiddenResponse(obj={}):
    return app.response_class(
        response=json.dumps(obj),
        status=403,
        mimetype='application/json'
    );


def JsonResponse(obj={}):
    return app.response_class(
        response=json.dumps(obj),
        status=200,
        mimetype='application/json'
    )


def BadRequestResponse(obj={}):
    return app.response_class(
        response=json.dumps(obj),
        status=400,
        mimetype='application/json'
    )

def InternalServerErrorResponse():
    return app.response_class(
        response=json.dumps({"success":False,"message":"Internal Server Error"}),
        status=500,
        mimetype='application/json'
    )
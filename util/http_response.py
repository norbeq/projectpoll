from flask import json, Flask, current_app as app

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

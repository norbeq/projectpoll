from .model import db
import datetime
import uuid

class Respondent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    guest_uuid = db.Column(db.String(64))
    ip_address = db.Column(db.INTEGER)
    start_date = db.Column(db.DateTime, default=datetime.datetime.now)
    end_date = db.Column(db.DateTime)
    os_platform = db.Column(db.String(64))
    user_agent = db.Column(db.String(64))
    form_id = db.Column(db.Integer, db.ForeignKey('form.id'), nullable=False)


    def __init__(self, form_id, ip_address = None, os_platform = None, user_agent = None):
        self.guest_uuid = uuid.uuid4()
        self.ip_address = ip_address
        self.form_uuid = str(uuid.uuid4())
        self.form_id = form_id
        self.os_platform = os_platform
        self.user_agent = user_agent
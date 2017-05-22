import sys
class User:
    users = {}
    def __init__(self, id, is_authenticated):
        self.is_authenticated = is_authenticated
        self.is_active = False
        self.is_anonymous = False
        self.id = id
        User.users[id] = self

    def get_id(self):
        return unicode(self.id)

    def get(self):
        return self

    @classmethod
    def find_logged_in(cls, user_id):
        if(user_id in cls.users):
            return cls.users[user_id]
        return None

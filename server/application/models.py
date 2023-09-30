from flask_login import UserMixin
from bson.objectid import ObjectId

class User(UserMixin):
    def __init__(self, user_data):
        self.id = str(user_data['_id'])  # convert ObjectId to string
        self.email = user_data['email']
        self.user_data = user_data  # store the entire user_data dictionary

    @property
    def is_authenticated(self):
        return True  # Assume all user instances represent authenticated users

    @property
    def is_active(self):
        return True  # Assume all users are active

    @property
    def is_anonymous(self):
        return False  # Anonymous users aren't represented by this class

    def get_id(self):
        return self.id  # Use self.id here instead of self.user_data['_id']

    def get(self, key):
        return self.user_data.get(key)  # Get other user attributes

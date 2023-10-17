import jwt
from functools import wraps
from flask import request, jsonify, current_app as app
from application import mongo
from bson.objectid import ObjectId
import logging

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
        print(f'Received token: {token}')  
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = mongo.db.users.find_one({"_id": ObjectId(data['user_id'])})
        except Exception as e: 
            print(f'Error decoding token: {e}')  
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated


from flask import request, jsonify
from application.users import users_bp
from application import mongo
from bson.objectid import ObjectId

@users_bp.route('/')
def get_users():
    users = list(mongo.db.users.find({}, {'_id': 0, 'first_name': 1, 'last_name': 1, 'email': 1, 'weight': 1, 'height': 1, 'gender': 1}))
    return jsonify(users)

@users_bp.route('/', methods=['POST'])
def create_user():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid data"}), 400
    mongo.db.users.insert_one(data)
    return jsonify({"message": "User created successfully"}), 201

@users_bp.route('/<user_id>', methods=['GET'])
def get_user(user_id):
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if user:
        user['_id'] = str(user['_id'])
        return jsonify(user)
    return jsonify({"message": "User not found"}), 404


@users_bp.route('/<user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid data"}), 400
    mongo.db.users.update_one({"_id": ObjectId(user_id)}, {"$set": data})
    return jsonify({"message": "User updated successfully"})

@users_bp.route('/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    mongo.db.users.delete_one({"_id": ObjectId(user_id)})
    return jsonify({"message": "User deleted successfully"})

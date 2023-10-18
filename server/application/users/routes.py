from flask import request, jsonify
from application.users import users_bp
from application import mongo
from bson.objectid import ObjectId
import bcrypt
from flask_bcrypt import Bcrypt
from application.decorators import token_required
import logging

bcrypt = Bcrypt()

@users_bp.route('/')
def get_users():
    users = list(mongo.db.users.find({}, {'_id': 0, 'first_name': 1, 'last_name': 1, 'email': 1, 'weight': 1, 'height': 1, 'gender': 1}))
    return jsonify(users)

@users_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        print('No JSON data received')  
        return jsonify({"message": "Invalid data"}), 400
    
    # check if email is already in use
    existing_user = mongo.db.users.find_one({"email": data.get('email')})
    if existing_user:
        return jsonify({"message": "Email is already in use. Please use a different email."}), 400
    
    plaintext_password = data.get('password')
    hashed_password = bcrypt.generate_password_hash(plaintext_password).decode('utf-8')
    data['password'] = hashed_password

    # Convert height and weight to integers
    try:
        data['height'] = int(data.get('height', 0).replace('cm', ''))  # remove 'cm' and defaults to 0 if height is not provided
        data['weight'] = int(data.get('weight', 0).replace('kg', '').replace('lb', ''))  # remove 'kg' or 'lb' and defaults to 0 if weight is not provided
    except ValueError as ve:
        return jsonify({"message": "Invalid height or weight format"}), 400

    mongo.db.users.insert_one(data)
    return jsonify({"message": "User registered successfully"}), 201
 

@users_bp.route('/<user_id>', methods=['GET'])
@token_required
def get_user(user_id):
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if user:
        user['_id'] = str(user['_id'])
        return jsonify(user)
    return jsonify({"message": "User not found"}), 404


@users_bp.route('/<user_id>', methods=['PATCH'])
def update_user(user_id):
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid data"}), 400

    if 'password' in data:
        plaintext_password = data.get('password')
        hashed_password = bcrypt.generate_password_hash(plaintext_password).decode('utf-8')
        data['password'] = hashed_password

    # Convert height and weight to integers
    if 'height' in data:
        data['height'] = int(data['height'])
    if 'weight' in data:
        data['weight'] = int(data['weight'])

    mongo.db.users.update_one({"_id": ObjectId(user_id)}, {"$set": data})
    return jsonify({"message": "User updated successfully"})


@users_bp.route('/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    mongo.db.users.delete_one({"_id": ObjectId(user_id)})
    return jsonify({"message": "User deleted successfully"})

@users_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    logging.info(f'Current user: {current_user}')
    user = {
        '_id': str(current_user['_id']),
        'first_name': current_user['first_name'],
        'last_name': current_user['last_name'],
        'email': current_user['email'],
        "gender": current_user['gender'],
        "height": current_user['height'],
        "weight": current_user['weight'],
    }
    return jsonify(user)


@users_bp.route('/change-password', methods=['POST'])
@token_required
def change_password(current_user):
    data = request.get_json()
    old_password = data.get('oldPassword')
    new_password = data.get('newPassword')

    # No need to hash the old_password here, it should be compared in plaintext
    # hashed_old_password = bcrypt.generate_password_hash(old_password).decode('utf-8')
    hashed_new_password = bcrypt.generate_password_hash(new_password).decode('utf-8')

    # Correctly compare the plaintext old_password with the hashed password from the database
    if bcrypt.check_password_hash(current_user['password'], old_password):
        mongo.db.users.update_one({"_id": ObjectId(current_user['_id'])}, {"$set": {"password": hashed_new_password}})
        return jsonify({"message": "Password updated successfully"})
    else:
        return jsonify({"message": "Old password is incorrect"}), 401

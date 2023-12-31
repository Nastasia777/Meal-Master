from flask import request, jsonify
from application.users import users_bp
from application import mongo
from bson.objectid import ObjectId
import bcrypt
from flask_bcrypt import Bcrypt
from application.decorators import token_required
import logging
import re

bcrypt = Bcrypt()

@users_bp.route('/')
def get_users():
    users = list(mongo.db.users.find({}, {'_id': 0, 'first_name': 1, 'last_name': 1, 'email': 1, 'weight': 1, 'height': 1, 'gender': 1}))
    return jsonify(users)

@users_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid data"}), 400

    existing_user = mongo.db.users.find_one({"email": data.get('email')})
    if existing_user:
        return jsonify({"message": "Email is already in use. Please use a different email."}), 400

    plaintext_password = data.get('password')
    hashed_password = bcrypt.generate_password_hash(plaintext_password).decode('utf-8')
    data['password'] = hashed_password

    # Converting weight and height into numerical values
    weight, weight_unit = extract_number_and_unit(data.get('weight', ''))
    height, height_unit = extract_number_and_unit(data.get('height', ''))

    data['weight'] = weight
    data['height'] = height
    data['weightUnit'] = weight_unit or 'kg'
    data['heightUnit'] = height_unit or 'cm'

    mongo.db.users.insert_one(data)
    return jsonify({"message": "User registered successfully"}), 201

def extract_number_and_unit(value_str):
    match = re.search(r'(\d+(?:\.\d+)?)(\D+)', value_str)
    if match:
        return float(match.group(1)), match.group(2).strip()
    return None, None

@users_bp.route('/<user_id>', methods=['GET'])
@token_required
def get_user(user_id):
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if user:
        user['_id'] = str(user['_id'])
        return jsonify(format_user_data(user))
    return jsonify({"message": "User not found"}), 404

def format_user_data(user):
    return {
        '_id': str(user['_id']),
        'first_name': user['first_name'],
        'last_name': user['last_name'],
        'email': user['email'],
        'gender': user['gender'],
        'weight': user['weight'],
        'height': user['height'],
        'weightUnit': user.get('weightUnit', 'kg'),
        'heightUnit': user.get('heightUnit', 'cm'),
        'unitPreference': user.get('unitPreference', {'weight': 'kg', 'height': 'cm'})
    }

@users_bp.route('/<user_id>', methods=['PATCH'])
def update_user(user_id):
    data = request.get_json()
    logging.info(f"Updating user data: {data}")
    if not data:
        return jsonify({"message": "Invalid data"}), 400

    if 'password' in data:
        plaintext_password = data.get('password')
        hashed_password = bcrypt.generate_password_hash(plaintext_password).decode('utf-8')
        data['password'] = hashed_password

    # Updating weight and height

    if 'weight' in data:
        weight_value, weight_unit = extract_number_and_unit(data['weight'])
        data['weight'] = weight_value
        data['weightUnit'] = weight_unit

    if 'height' in data:
        height_value, height_unit = extract_number_and_unit(data['height'])
        data['height'] = height_value
        data['heightUnit'] = height_unit

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
    return jsonify(format_user_data(current_user))

@users_bp.route('/change-password', methods=['POST'])
@token_required
def change_password(current_user):
    data = request.get_json()
    old_password = data.get('oldPassword')
    new_password = data.get('newPassword')

    if bcrypt.check_password_hash(current_user['password'], old_password):
        hashed_new_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        mongo.db.users.update_one({"_id": ObjectId(current_user['_id'])}, {"$set": {"password": hashed_new_password}})
        return jsonify({"message": "Password updated successfully"})
    else:
        return jsonify({"message": "Old password is incorrect"}), 401

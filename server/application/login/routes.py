from flask import Blueprint, request, jsonify
from flask_login import login_user
from application import bcrypt  
from application import mongo  
from application.models import User  
from flask_login import logout_user

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")
    
    is_valid, message = validate_input(email, password)
    if not is_valid:
        return jsonify(message=message), 400
    
    user_data = mongo.db.users.find_one({"email": email})
    
    if user_data:
        # Check if the hashed password in the database matches the provided password
        check_password = bcrypt.check_password_hash(user_data['password'], password)
        if check_password:
            # Create a User instance from the MongoDB query result
            user = User(user_data)  

            # Passwords match, login the user
            login_user(user) 
            return (
                jsonify(
                    id=str(user_data['_id']),
                    first_name=user_data['first_name'],
                    last_name=user_data['last_name'],
                    email=user_data['email'],
                ),
                200,
            )
        else:
            # Passwords do not match, deny access
            return jsonify({"message": "Invalid email or password"}), 401
    else:
        # User does not exist, deny access
        return jsonify({"message": "Invalid email or password"}), 401

def validate_input(email, password):
    if not email or not password:
        return False, "Email and password are required"

    return True, ""

@auth_bp.route("/logout", methods=["GET"])
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200

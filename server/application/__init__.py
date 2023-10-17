from flask import Flask
from flask_login import LoginManager
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
from bson.objectid import ObjectId
from flask_login import UserMixin
from flask_cors import CORS
import os

cwd = os.getcwd()
env_path = os.path.join(cwd, '.env')

load_dotenv(dotenv_path=env_path)


app = Flask(__name__, static_folder='../static', template_folder='../templates')
CORS(app) 
bcrypt = Bcrypt(app)
login_manager = LoginManager()  # Create instance of LoginManager


app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
app.config["MONGO_URI"] = os.environ.get("MONGO_URI")

mongo = PyMongo(app)

print(f'SECRET_KEY from .env: {app.config["SECRET_KEY"]}') # checking if the SECRET_KEY is set correctly

login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if user:
        return User(user)
    return None

# Importing Blueprints
from application.vegies import vegies_bp
from application.users import users_bp
from application.login.routes import auth_bp
from application.models import User  

# Register Blueprints
app.register_blueprint(vegies_bp, url_prefix='/vegies')
app.register_blueprint(users_bp, url_prefix='/users')
app.register_blueprint(auth_bp, url_prefix='/auth')

print(app.config["MONGO_URI"]) # checking if the URI is set correctly

from application import routes

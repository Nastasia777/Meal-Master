import os
from dotenv import load_dotenv
from flask import Flask
from flask_pymongo import PyMongo
from flask_talisman import Talisman


load_dotenv()

app = Flask(__name__, static_folder='../static', template_folder='../templates')

app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
app.config["MONGO_URI"] = os.environ.get("MONGO_URI")

csp = {
    'default-src': "'self'",
    'img-src': '*',
    'style-src': "'self' 'unsafe-inline'",
    'script-src': "'self'",
}

talisman = Talisman(app, content_security_policy=csp)


mongo = PyMongo(app)
db = mongo.db
from application.vegies import vegies_bp
from application.users import users_bp

app.register_blueprint(vegies_bp, url_prefix='/vegies')
app.register_blueprint(users_bp, url_prefix='/users')

print(app.config["MONGO_URI"]) # checking if the URI is set correctly
from application import routes

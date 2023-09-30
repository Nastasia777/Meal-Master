from flask import Blueprint

vegies_bp = Blueprint('vegies', __name__, template_folder='templates')

from . import routes


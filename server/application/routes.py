import os
from flask import render_template, send_from_directory
from application import app

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(app.static_folder, 'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route("/")
def index():
    template_path = os.path.join(app.root_path, 'templates', 'index.html')
    app.logger.debug(f'Template path: {template_path}')
    return render_template("index.html")

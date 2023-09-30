from flask import request, jsonify
from . import vegies_bp
from application import mongo

@vegies_bp.route('/')
def get_vegies():
    vegies = list(mongo.db.vegies.find({}, {'_id': 0, 'name': 1, 'color': 1}))
    return jsonify(vegies)

@vegies_bp.route('/', methods=['POST'])
def create_vegie():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid data"}), 400
    mongo.db.vegies.insert_one(data)
    return jsonify({"message": "Veggie created successfully"}), 201

@vegies_bp.route('/<vegie_name>', methods=['GET'])
def get_vegie(vegie_name):
    vegie = mongo.db.vegies.find_one({"name": vegie_name}, {'_id': 0, 'name': 1, 'color': 1})
    if vegie:
        return jsonify(vegie)
    return jsonify({"message": "Veggie not found"}), 404

@vegies_bp.route('/<vegie_name>', methods=['PUT'])
def update_vegie(vegie_name):
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid data"}), 400
    mongo.db.vegies.update_one({"name": vegie_name}, {"$set": data})
    return jsonify({"message": "Veggie updated successfully"})

@vegies_bp.route('/<vegie_name>', methods=['DELETE'])
def delete_vegie(vegie_name):
    mongo.db.vegies.delete_one({"name": vegie_name})
    return jsonify({"message": "Veggie deleted successfully"})

from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_bcrypt import Bcrypt


client = MongoClient('mongodb://localhost:27017/')
db = client['food']  # database name
users_collection = db['users']


bcrypt = Bcrypt()


user_passwords = {
    "65145dfaeaa81ed3b618ecbe": "plain_text_password_1",
    "65145e21eaa81ed3b618ecc2": "plain_text_password_2",
    "6516a162e0372aaf9a7fb696": "plain_text_password_3",
    "65180824b00015ad44b3424c": "plain_text_password_4",

}


for user_id, plain_text_password in user_passwords.items():
    hashed_password = bcrypt.generate_password_hash(plain_text_password).decode('utf-8')
    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"password": hashed_password}}
    )

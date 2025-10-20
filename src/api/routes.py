"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

api = Blueprint('api', __name__)
bcrypt = Bcrypt()
# Allow CORS requests to this API
CORS(api)

@api.route('/user', methods=["POST"])
def create_user():
    email = request.json.get('email')
    password = request.json.get('password')
    name = request.json.get('name')

    if not email:
        return jsonify({ "error": "Email is required" }), 400
    if not password or len(password) < 8:
        return jsonify({ "error": "Password must be at least 8 characters" }), 400
    if not name:
        return jsonify({ "error": "Name is required" }), 400

    if User.query.filter_by(email=email).first():
        return jsonify({ "error": "User already exists" }), 400

    #Encrypt password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(
        name=name, 
        email=email, 
        password=hashed_password, 
        is_active=True,
        role="user")

    db.session.add(user)
    db.session.commit()

    return jsonify({ "message": "User created" }), 200

@api.route('/user/login', methods=['POST'])
def login():
    email = request.json.get("email")
    password = request.json.get("password")
    if email is None or password is None:
        return 'Email or password are required', 400
     
    user = User.query.filter_by(email=email).first()
    if user is None:
        return 'User does not exist', 400
     
    if not bcrypt.check_password_hash(user.password, password):
        return 'Password invalid', 400
     
    access_token = create_access_token(identity=email) # genra el token a partir del email
    return jsonify({ "access_token": access_token, "user": user.serialize() }), 200 #con access_token devuelvo el token al frontend

@api.route('/users')
@jwt_required() # protejes rutas quiere decir exigir el token
def get_all_users():
    users = User.query.all()
    users = list(map(lambda user: user.serialize(), users))

    return jsonify(users), 200
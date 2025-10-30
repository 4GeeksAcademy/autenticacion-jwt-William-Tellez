"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
import os
import requests
from deep_translator import GoogleTranslator
from functools import lru_cache
from flask import Response

BASE_URL = os.getenv("EXERCISEDB_BASE_URL")
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
RAPIDAPI_HOST = os.getenv("RAPIDAPI_HOST")
translation_cache = {}

api = Blueprint('api', __name__)
bcrypt = Bcrypt()
# Allow CORS requests to this API
CORS(api)


# Función para guardar caché de la traducción
def translate_cached(text, source="en", target="es"):
    if text in translation_cache:
        return translation_cache[text]
    else:
        translated = GoogleTranslator(
            source=source, target=target).translate(text)
        translation_cache[text] = translated
        return translated


@api.route('/user', methods=["POST"])
def create_user():
    email = request.json.get('email')
    password = request.json.get('password')
    name = request.json.get('name')

    if not email:
        return jsonify({"error": "Email is required"}), 400
    if not password or len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400
    if not name:
        return jsonify({"error": "Name is required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400

    # Encrypt password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(
        name=name,
        email=email,
        password=hashed_password,
        is_active=True,
        role="user")

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created"}), 200


@api.route('/user/login', methods=['POST'])
def login():
    email = request.json.get("email")
    password = request.json.get("password")
    if email is None or password is None:
        return jsonify({"message": "Email or password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"message": "User does not exist"}), 400

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Password invalid"}), 400

    # genra el token a partir del email
    access_token = create_access_token(identity=email)
    # con access_token devuelvo el token al frontend
    return jsonify({"access_token": access_token, "user": user.serialize()}), 200


@api.route('/users')
@jwt_required()  # protejer rutas exigir el token
def get_all_users():
    users = User.query.all()
    users = list(map(lambda user: user.serialize(), users))
    return jsonify(users), 200


@api.route('/user/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "Usuario eliminado"}), 200


@api.route('/user/<int:user_id>/role', methods=['PUT'])
@jwt_required()
def assign_role(user_id):
    current_user_email = get_jwt_identity()
    current_user = User.query.filter_by(email=current_user_email).first()

    if current_user.role != "superadmin":
        return jsonify({"msg": "Solo el superadmin puede asignar roles"}), 403

    data = request.get_json()
    new_role = data.get("role")

    if new_role not in ["admin", "user"]:
        return jsonify({"msg": "Rol inválido"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    user.role = new_role
    db.session.commit()
    return jsonify({}), 200

# ENDPOINT RUTINAS DE EJERCICIOS

# Función para guardar caché de la traducción
def translate_cached(text, source="en", target="es"):
    if text in translation_cache:
        return translation_cache[text]
    else:
        translated = GoogleTranslator(
            source=source, target=target).translate(text)
        translation_cache[text] = translated
        return translated

@api.route('/exercise/image/<exercise_id>', methods=['GET'])
def get_exercise_image(exercise_id):
    resolution = request.args.get("resolution", "180")
    url = f"https://exercisedb.p.rapidapi.com/image?exerciseId={exercise_id}&resolution={resolution}"
    headers = {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST
    }
    try:
        resp = requests.get(url, headers=headers, stream=True)
        resp.raise_for_status()
        return resp.content, 200, {"Content-Type": "image/gif"}
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

@api.route('/exercises', methods=['GET'])
def get_exercises():
    body_part = request.args.get('bodyPart')
    limit = request.args.get('limit', default=6, type=int)
    offset = request.args.get('offset', default=0, type=int)
    print("Offset recibido:", offset)

    if not body_part:
        return jsonify([])  # si no hay filtro, no devuelve nada
    
    url = f"{BASE_URL}/bodyPart/{body_part}?limit={limit}&offset={offset}"

    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        all_exercises = response.json()

        # Traducción
        for ex in all_exercises:
            texto = f"{ex['name']} - {ex['bodyPart']} - {ex['equipment']}"
            traduccion = translate_cached(texto)
            partes = traduccion.split(" - ")

            ex["name"] = partes[0] if len(partes) > 0 else ex["name"]
            ex["bodyPart"] = partes[1] if len(partes) > 1 else ex["bodyPart"]
            ex["equipment"] = partes[2] if len(partes) > 2 else ex["equipment"]

        return jsonify(all_exercises)

    except requests.exceptions.RequestException as e:
        print("ERROR AL CONSULTAR RAPIDAPI:", e)
        return jsonify({"error": str(e)}), 500

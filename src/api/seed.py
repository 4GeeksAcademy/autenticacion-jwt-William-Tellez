import os
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from api.models import db, User

# Cargar variables desde .env
from dotenv import load_dotenv
load_dotenv()

# Configurar Flask con PostgreSQL desde .env
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar extensiones
db.init_app(app)
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)
CORS(app)

# Crear superadmin si no existe
with app.app_context():
    existing = User.query.filter_by(email="admin@gymio.com").first()
    if existing:
        print("El superadmin ya existe:", existing.email)
    else:
        hashed_pw = bcrypt.generate_password_hash("password").decode('utf-8')
        superadmin = User(
            name="Super Admin",
            email="admin@gymio.com",
            password=hashed_pw,
            is_active=True,
            role="superadmin"
        )
        db.session.add(superadmin)
        db.session.commit()
        print("Superadmin creado con éxito:", superadmin.email)
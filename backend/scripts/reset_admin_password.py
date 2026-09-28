from getpass import getpass

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User


email = "carlos@gmail.com"

password = getpass("Nueva contraseña: ")

if len(password) < 8:
    raise ValueError("La contraseña debe tener al menos 8 caracteres.")

with SessionLocal() as session:
    user = session.query(User).filter(User.email == email).first()

    if user is None:
        raise ValueError(f"No existe el usuario {email}")

    user.password_hash = hash_password(password)
    session.commit()

    print("Contraseña actualizada correctamente.")
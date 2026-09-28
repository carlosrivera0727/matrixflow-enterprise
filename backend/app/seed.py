"""Command-line entry point for idempotent development seed data."""

from app.bootstrap import seed_development_users


def main() -> None:
    seed_development_users()
    print("Usuarios de demostración verificados correctamente.")


if __name__ == "__main__":
    main()

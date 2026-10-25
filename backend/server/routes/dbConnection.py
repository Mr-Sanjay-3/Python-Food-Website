import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
from pathlib import Path
import os

# Load .env from current directory (routes/.env) or parent directories
env_path = Path(__file__).resolve().parent / ".env"
if not env_path.exists():
    env_path = Path(__file__).resolve().parent.parent.parent / ".env"

load_dotenv(env_path, override=True)


def get_connection():
    try:
        conn = mysql.connector.connect(
            user=os.getenv("USER"),
            password=os.getenv("PASSWORD"),
            host=os.getenv("HOST"),
            port=int(os.getenv("PORT", 19271)),
            database=os.getenv("DATABASE"),
        )
        return conn
    except Error as err:
        print(f"Error on connection: {err}")
        return None


if __name__ == "__main__":
    conn = get_connection()
    if conn and conn.is_connected():
        print("Status: DB Connected successfully")
        conn.close()
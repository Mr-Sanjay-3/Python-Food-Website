import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
from pathlib import Path
import os

for p in [
    Path(__file__).resolve().parent / ".env",
    Path(__file__).resolve().parent.parent / ".env",
    Path(__file__).resolve().parent.parent.parent / ".env",
]:
    if p.exists():
        load_dotenv(p, override=True)
        break


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
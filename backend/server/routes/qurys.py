from mysql.connector import Error
from .dbConnection import get_connection


def get_all_foods():
    conn = get_connection()
    if not conn:
        return []

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, name, category, price, imageuri FROM routes_products ORDER BY id ASC;")
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result
    except Error as err:
        print(f"Error fetching foods from DB: {err}")
        if conn:
            conn.close()
        return []

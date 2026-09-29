# from backend.server.routes.dbConnection import get_connection ;
from mysql.connector import Error
from .dbConnection  import get_connection



 
def get_all_foods():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM food_data')
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result



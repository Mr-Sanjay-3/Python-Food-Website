from backend.server.routes.dbConnection import get_connection ;

conn = get_connection();

cursor = conn.cursor();

cursor.execute('USE foodweb;')
cursor.execute('SELECT * FROM food_data;')

data = cursor.fetchall();

print(data)
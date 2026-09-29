import mysql.connector;
from mysql.connector  import Error;
from dotenv import load_dotenv
from pathlib import Path
import os

# env_path =Path(".env");
# load_dotenv(dotenv_path=env_path);
# print(os.getenv('USER'))




def get_connection():
        
    try:
        conn = mysql.connector.connect(
            user= 'root',
            password ='KittenRoy',
            host ='127.0.0.1',
            port =3306,
            database='foodweb'
        
        )   
        return conn

    except Error as err:
        print(f"Error : on connection {err}")
        return None;  



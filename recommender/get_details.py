import pandas as pd
from mysql_connection import get_cursor

def get_name(id):
	cursor = get_cursor()
	cursor.execute(f"SELECT Nickname FROM User WHERE UserID={id}")
	return cursor.fetchone()

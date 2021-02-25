import mysql.connector

db = mysql.connector.connect(
    host="",
    user="",
    password="",
    port=""
  )

def get_cursor():
  cursor = db.cursor()
  cursor.execute("use tat")
  cursor.fetchone()
  return cursor
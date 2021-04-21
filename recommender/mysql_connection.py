import mysql.connector

db = mysql.connector.connect(
    host="",
    user="",
    password="",
    port="3307"
  )

def get_cursor():
  cursor = db.cursor()
  cursor.execute("use tat")
  cursor.fetchone()
  return cursor

def commit():
  db.commit()
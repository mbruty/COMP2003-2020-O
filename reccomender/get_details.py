from mysql_connection import get_cursor

def get_details(id):
  cursor = get_cursor()
  statement = "select * from User where UserID=" + str(id)
  cursor.execute(statement)
  return cursor.fetchone()
  
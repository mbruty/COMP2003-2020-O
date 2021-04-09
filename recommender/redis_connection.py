import redis 

def get_connection():
  # See teams for the connection details
  return redis.Redis(host="", password="")
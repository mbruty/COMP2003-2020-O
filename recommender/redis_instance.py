import redis
r = redis.Redis( host='51.195.201.170', password='')

def get_instance():
  return r
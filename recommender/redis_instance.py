import redis
r = redis.Redis( host='51.195.201.170', password='$oe0dzSH8AYEtDGkw*XoTSwoLlQSy54KXci#X8Jc')

def get_instance():
  return r
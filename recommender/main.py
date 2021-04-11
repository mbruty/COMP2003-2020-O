from flask import Flask
from flask_restful import Api, Resource, reqparse
import sys
from get_details import get_name
from process_swipe import process_swipe
import requests
from flask_socketio import SocketIO
from flask_socketio import join_room, leave_room, send, emit
import random
from eventlet import wsgi
import eventlet
from redis_instance import get_instance
r = get_instance()

# 1 day
EXPIRATION_TIME = 86400

like_post_args = reqparse.RequestParser()
like_post_args.add_argument(
    "foodid", type=int, help="The ID of the food item swiped on")
like_post_args.add_argument("userid", type=str, help="Your UserID")
like_post_args.add_argument("authtoken", type=str, help="Authorisation token")
like_post_args.add_argument(
    "islike", type=bool, help="If the like was like / dislike")
like_post_args.add_argument(
    "isfavourite", type=bool, help="If it was a super like")

app = Flask(__name__)
api = Api(app)
socketio = SocketIO(app)


class SwipeController(Resource):
    # post [/swipe]
    def post(self):
        args = like_post_args.parse_args()
        payload = {"authtoken": args.authtoken, "userid": args.userid}
        r = requests.post(
            'http://devapi.trackandtaste.com/user/authcheck', json=payload)
        if r.status_code != 200:
            return '', r.status_code
        else:
            try:
                process_swipe(args.userid, args.foodid,
                              args.islike, args.isfavourite)
            except Exception:
                # Food item not found
                return '', 404
            return '', 201


@socketio.on('message')
def handle_message(message):
    print(message)


@socketio.on('create')
def handle_create(data):
    uid = data["id"]
    latlon = data["latlon"]
    distance = data["distance"]
    print(latlon)
    print(distance)
    name = get_name(uid)[0]
    code = random.randint(100000, 999999)
    # Check for the odd ocassion that the code exists
    while r.exists(f"room-{code}-users"):
        code = random.randint(100000, 999999)
    # Send back the code
    emit("room_code", code)
    # Join the room
    join_room(code)
    # Create the list of users
    r.sadd(f"room-{code}-users", f"{uid}:{name}:false:true")
    r.set(f"room-{code}-location", latlon)
    r.set(f"room-{code}-distance", distance)
    
    # Create a key value for the owwner so we can re-route them to the room on connectg
    r.set(f"room-owner-{uid}", code)

    r.expire(f"room-{code}-users", EXPIRATION_TIME)
    r.expire(f"room-{code}-location", EXPIRATION_TIME)
    r.expire(f"room-{code}-distance", EXPIRATION_TIME)

    users = get_all_users_in_room(code)
    emit("user_join", users, room=code)


@socketio.on('join_check')
def handle_join_check(data):
    uid = data["id"]
    room_code = r.get(f"room-owner-{uid}")
    # If they already have a room code
    if room_code != None:
        code = room_code.decode("UTF-8")
        print(code)
        emit("room_code", code)
        on_join({"id": uid, "room": code})

@socketio.on('kick')
def on_kick(data):
    print(data)
    to_kick = data['kick']
    room = data['room']
    emit("kick", to_kick, room=room)


@socketio.on('join')
def on_join(data):
    uid = data["id"]
    username = get_name(uid)[0]
    room = data['room']
    if not r.exists(f"room-{room}-users"):
        # The room they're trying to join isn't valid
        send("Room does not exist")
        return
    join_room(room)
    owns_room = "false"
    owned_room = r.get(f"room-owner-{uid}")
    if owned_room != None:
        print(owned_room.decode("UTF-8") + " : " + room)
    if owned_room != None and owned_room.decode("UTF-8") == room:
        print("owns room")
        owns_room = "true"
    r.sadd(f"room-{room}-users", f"{uid}:{username}:false:{owns_room}")
    r.expire(f"room-{room}-users", EXPIRATION_TIME)
    users = get_all_users_in_room(room)
    emit("user_join", users, room=room)


@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    emit("leave", username + ' has left the room.', room=room)


@socketio.on('disconnect')
def on_disconnect():
    print("OOF")


@socketio.on('connect')
def on_connect():
    emit("join_check")
    print("connect")

def get_all_users_in_room(id):
    redis_data = r.smembers(f"room-{id}-users")
    users = []
    for i in redis_data:
        raw = i.decode("UTF-8")
        split = raw.split(":")
        users.append({"uid": split[0], "name": split[1], "ready": split[2], "owner": split[3]})
    return users


api.add_resource(SwipeController, "/swipe")

if __name__ == "__main__":
    socketio.run(app)
    wsgi.server(eventlet.listen(('', 8000)), app)

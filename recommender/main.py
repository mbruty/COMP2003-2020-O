from flask import Flask
from flask_restful import Api, Resource, reqparse
import sys
from get_details import get_details
from process_swipe import process_swipe
import requests
from flask_socketio import SocketIO
from flask_socketio import join_room, leave_room, send, emit


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


def serialize_user(user_arr):
    data = []
    for user in user_arr:
        data.append({
            "user_id": int(user.user_id),
            "top_five_likes": serialize_tuple_array(user.top_five_likes),
            "top_five_dislikes": serialize_tuple_array(user.top_five_dislikes)
        })
    return data


def serialize_tuple_array(array):
    data = []
    for item in array:
        data.append({
            "food_check_id": int(item[0]),
            "swipe_right_pct": float(item[1])
        })
    return data


class ReccomenderController(Resource):
    # get [/id]
    def get(self, id):
        data = get_details(id)
        return serialize_user(data)


class SwipeController(Resource):
    # post [/swipe]
    def post(self):
        args = like_post_args.parse_args()
        payload = {	"authtoken": args.authtoken,	"userid": args.userid}
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


@socketio.on('kick')
def on_kick(data):
    print(data)
    to_kick = data['kick']
    room = data['room']
    emit("kick", to_kick, room=room)


@socketio.on('join')
def on_join(data):
    print(data)
    username = data['username']
    room = data['room']
    join_room(room)
    emit("user_join", username + ' has entered the room.', room=room)


@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    emit("leave", username + ' has left the room.', room=room)


api.add_resource(ReccomenderController, "/<int:id>")
api.add_resource(SwipeController, "/swipe")
if __name__ == "__main__":
    socketio.run(app)
    if("-d" in sys.argv):
        app.run(debug=True)
    else:
        app.run()

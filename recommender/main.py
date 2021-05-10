from flask import Flask
from flask_restful import Api, Resource
import sys
from get_details import get_details
import jsonpickle

app = Flask(__name__)
api = Api(app)
<<<<<<< Updated upstream
=======
socketio = SocketIO(app)


class RecommenderController(Resource):
    #get [/swipestack]
    def post(self):
        args = swipestack_args.parse_args()
        payload = {"authtoken": args.authtoken, "userid": args.userid}
        r = requests.post(
            'http://devapi.trackandtaste.com/user/authcheck', json=payload)
        if r.status_code != 200:
            return '', r.status_code
        try:
            data = get_swipe_stack(args.lat, args.lng, args.userid, args.distance)
        except Exception as e :
            print(e)
            print(traceback.format_exc())
            return '', 404 # We couldn't find any restaurants
        return json.loads(data), 200        

class SwipeController(Resource):
    # post [/swipe]
    def post(self):
        args = like_post_args.parse_args()
        payload = {"authtoken": args.authtoken, "userid": args.userid}
        r = requests.post(
            'http://devapi.trackandtaste.com/user/authcheck', json=payload)
        if r.status_code != 200:
            return '', r.status_code
        try:
            process_swipe(args.userid, args.foodid,
                            args.islike, args.isfavourite)
            r.lpush(f"Recommendations-{args.userid}", *args.foodid)
            r.expire(f"Recommendations-{args.userid}", 7200)
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

>>>>>>> Stashed changes

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


api.add_resource(ReccomenderController, "/<int:id>")

if __name__ == "__main__":

	if("-d" in sys.argv):
		app.run(debug=True)
	else:
		app.run()

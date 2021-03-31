from flask import Flask
from flask_restful import Api, Resource
import sys
from get_details import get_details
import jsonpickle

app = Flask(__name__)
api = Api(app)

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

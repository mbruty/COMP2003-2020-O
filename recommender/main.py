from flask import Flask
from flask import jsonify
from flask_restful import Api, Resource, reqparse
import json
import sys
from get_details import get_name
from process_swipe import process_swipe
import requests
import random
from eventlet import wsgi
import eventlet
from redis_instance import get_instance
from RecommendationEngine import get_swipe_stack
import traceback
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
like_post_args.add_argument("isGroup", type=bool, help="If the swipe stack you're getting is for a group")

swipestack_args = reqparse.RequestParser()
swipestack_args.add_argument(
    "lat", type=float, help="Lattitude of where to search recommendations"
)
swipestack_args.add_argument(
    "lng", type=float, help="Longitude of where to search recommendations"
)
swipestack_args.add_argument(
    "userid", type=str, help="The userID"
)
swipestack_args.add_argument("authtoken", type=str, help="Authorisation token")
swipestack_args.add_argument("code", type=str, help="Room code")
swipestack_args.add_argument("isGroup", type=bool, help="If the swipe stack you're getting is for a group")
swipestack_args.add_argument(
    "distance", type=float, help="Radius of the circle to search within"
)

app = Flask(__name__)
api = Api(app)


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
        print(args)
        payload = {"authtoken": args.authtoken, "userid": args.userid}
        res = requests.post(
            'http://devapi.trackandtaste.com/user/authcheck', json=payload)
        if res.status_code != 200:
            return '', r.status_code
        try:
            process_swipe(args.userid, args.foodid,
                            args.islike, args.isfavourite)
            # If the swipe doesn't come from the group page, cache it
            # Else caching is handled by the websocket server and is saved in mongo
            if not args.isGroup:
                r.lpush(f"Recommendations-{args.userid}", args.foodid)
                r.expire(f"Recommendations-{args.userid}", 7200)
        except Exception as e:
            print(e)
            print(traceback.format_exc())
            # Food item not found
            return '', 404
        return '', 201



api.add_resource(SwipeController, "/swipe")
api.add_resource(RecommenderController, "/swipestack")
if __name__ == "__main__":
    wsgi.server(eventlet.listen(('', 8000)), app)

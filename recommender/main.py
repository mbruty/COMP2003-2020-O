from re import L
from flask import Flask
from flask import jsonify
from flask import request
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
from mysql_connection import get_cursor
import traceback
import pymongo



mongod = pymongo.MongoClient("")
db = mongod["tat"]
collection = db["sessions"]
r = get_instance()

# 1 day
EXPIRATION_TIME = 86400

like_post_args = reqparse.RequestParser()
like_post_args.add_argument(
    "foodid", type=int, help="The ID of the food item swiped on")
like_post_args.add_argument("userid", type=str, help="Your UserID")
like_post_args.add_argument("restuarantid", type=int, help="The restaurants ID UserID")
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
swipestack_args.add_argument("code", type=int, help="Room code")
swipestack_args.add_argument("isGroup", help="If the swipe stack you're getting is for a group")
swipestack_args.add_argument(
    "distance", type=float, help="Radius of the circle to search within"
)

app = Flask(__name__)
api = Api(app)


class RecommenderController(Resource):
    #get [/swipestack]
    def post(self):
        args = swipestack_args.parse_args()
        print(args)
        payload = {"authtoken": args.authtoken, "userid": args.userid}
        r = requests.post(
            'http://devapi.trackandtaste.com/user/authcheck', json=payload)
        if r.status_code != 200:
            return '', r.status_code
        try:
            data = get_swipe_stack(args.lat, args.lng, args.userid, args.distance, args.isGroup == "True", str(args.code))
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
                print(args)
                r.lpush(f"Recommendations-{args.userid}", args.foodid)
                r.expire(f"Recommendations-{args.userid}", 7200)
                if args.islike or args.isfavourite:
                    r.lpush(f"Likes-{args.userid}", f"{args.foodid},{args.restuarantid}")
                    r.expire(f"Likes-{args.userid}", 7200)
        except Exception as e:
            print(e)
            print(traceback.format_exc())
            # Food item not found
            return '', 404
        return '', 201

class ItemController(Resource):
    #get [/likeditems]
    def get(self):
        args = request.args
        # If we're dealing with a group
        filtered = []

        if(args["isGroup"] == "true"):
            print("is group")
            room = collection.find_one({"code" : args["room"]}, {"restaurantsLiked": 1})
            userid = str(args["userID"])
            restaurantid = int(args["restaurantID"])
            for restaurant in room["restaurantsLiked"]:
                if restaurant["restaurantID"] == restaurantid:
                    for user in restaurant["likes"]:
                        if user["userID"] == userid:
                            for item in user["items"]:
                                filtered.append(str(item))
        else:
            print("Nota group")
            # We're dealing with individual swipe
            likedItems = [i.decode("UTF-8") for i in r.lrange(f"Likes-{args['userID']}", 0, -1)]
            for item in likedItems:
                if item.split(',')[1] == str(args["restaurantID"]):
                    filtered.append(item.split(',')[0])

        if len(filtered) == 0:
            return '', 404
        cursor = get_cursor()
        cursor.execute(f"SELECT Price, FoodNameShort, FoodID FROM FoodItem WHERE FoodID IN({','.join(filtered)});")
        result = cursor.fetchall()
        items = []
        for item in result:
            items.append({"price": str(item[0]),"name": item[1], "id": item[2]})
        print(items)
        return items, 200



api.add_resource(SwipeController, "/swipe")
api.add_resource(RecommenderController, "/swipestack")
api.add_resource(ItemController, "/likeditems")
if __name__ == "__main__":
    wsgi.server(eventlet.listen(('', 8000)), app)

from flask import Flask
from flask_restful import Api, Resource
import sys
from get_details import get_details


app = Flask(__name__)
api = Api(app)

class ReccomenderController(Resource):
  # get [/id]
  def get(self, id):
    # 
    detials = get_details(id)
    return {
      "user_id": detials[0],
      "email": detials[1]
    }


api.add_resource(ReccomenderController, "/<int:id>")

if __name__ == "__main__":

  if("-d" in sys.argv):
    app.run(debug=True)
  else:
    app.run()

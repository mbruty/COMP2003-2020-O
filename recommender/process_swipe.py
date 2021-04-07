from mysql_connection import get_cursor, commit

def process_swipe(user_id, food_id, is_like, is_favourite):
  cursor = get_cursor()
  cursor.execute(f"SELECT FoodTagID FROM FoodTags JOIN FoodItemTags FIT on FoodTags.FoodTagID = FIT.TagID JOIN FoodItem FI on FI.FoodID = FIT.FoodID WHERE FI.FoodID ={food_id};")
  results = cursor.fetchall()

  if len(results) == 0:
    raise Exception("Food ID not found") 

  # Favourite the items instead
  if is_favourite:
    # Create the values
    to_update = ",".join([f"({user_id}, {i[0]}, 1)" for i in results])
    cursor.execute(f"INSERT INTO FoodOpinion (UserID, FoodTagID, Favourite) VALUES {to_update} ON DUPLICATE KEY UPDATE Favourite = 1;")
    commit()
    return
  # Create the VALUES () part
  res = [f"({user_id}, {i[0]}, {int(is_like)}, {int(not is_like)})" for i in results]

  # Join the values on a ',' e.g. (1,1,1,0) , (1,2,1,0) , (1,3,1,0)
  food_tags = ",".join(res)
  cursor.execute(f"INSERT INTO FoodOpinion (UserID, FoodTagID, SwipeRight, SwipeLeft) VALUES {food_tags} ON DUPLICATE KEY UPDATE SwipeRight = SwipeRight + {int(is_like)}, SwipeLeft = SwipeLeft + {int(not is_like)};")  


  commit()


if(__name__ == "__main__"):
  # To test
  process_swipe(1,1, False)


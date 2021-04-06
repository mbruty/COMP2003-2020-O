from mysql_connection import get_cursor, commit

def process_swipe(user_id, food_id, is_like):
  cursor = get_cursor()
  cursor.execute(f"SELECT FoodTagID FROM FoodTags JOIN FoodItemTags FIT on FoodTags.FoodTagID = FIT.TagID JOIN FoodItem FI on FI.FoodID = FIT.FoodID WHERE FI.FoodID ={food_id};")
  results = cursor.fetchall()
  res = [f"({user_id}, {i[0]}, {int(is_like)}, {int(not is_like)})" for i in results]
  food_tags = ",".join(res)

  cursor.execute(f"INSERT INTO FoodOpinion (UserID, FoodTagID, SwipeRight, SwipeLeft) VALUES {food_tags} ON DUPLICATE KEY UPDATE SwipeRight = SwipeRight + {int(is_like)}, SwipeLeft = SwipeLeft + {int(not is_like)};")  
  commit()


if(__name__ == "__main__"):
  # To test
  process_swipe(1,1, False)


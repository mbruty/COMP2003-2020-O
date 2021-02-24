import pandas as pd
from mysql_connection import get_cursor
from user import User
NUMBER_OF_ITEMS_TO_GET = 5

COLUMN_ROWS = ["IsVegetarian", "IsVegan", "IsHalal", "IsKosher",
			   "HasLactose", "HasNuts", "HasGluten", "HasEgg", "HasSoy"]


def get_details(id):
	cursor = get_cursor()
	# Has to be in a tuple to work with sql proc
	user_id = (id,)
	cursor.callproc("get_foodchecks_by_id", user_id)
	checks = []
	# stored_results is iterable, have to do this way
	for result in cursor.stored_results():
		checks = result.fetchall()[0][1:]
		cursor.execute(
			f"SELECT UserID, FoodTagID, RightSwipePercent FROM FoodOpinionRightSwipePercent WHERE UserID IN(SELECT UserID FROM tat.UserFoodCheckView WHERE {food_checks_builder(checks)});"
		)
	result = cursor.fetchall()
	df = pd.DataFrame(result)
	df.columns = ["UserID", "FoodTagID", "RightSwipePercent"]
	pointer = 0
	data = []

	while pointer < len(df):
		user_indexes = df["UserID"][df["UserID"] == df["UserID"][pointer]].index
		first_occurance, last_occurance = user_indexes[0], user_indexes[-1]

		# If the user hasn't swiped on atleast 10 items, skip them

		if len(user_indexes) < 10:
			# The index after last_occurance will be the next item
			pointer = last_occurance + 1
		else:
			most_liked = df[first_occurance: first_occurance +
							NUMBER_OF_ITEMS_TO_GET]
			most_disliked = df[last_occurance -
							NUMBER_OF_ITEMS_TO_GET: last_occurance]
			new_user = User(most_liked, most_disliked, False)
			data.append(new_user)
			pointer = last_occurance + 1
	
	return data


def food_checks_builder(result):
	food_checks = []
	for i in range(len(result)):
		if(result[i]):
			food_checks.append(f"{COLUMN_ROWS[i]}=1")
	return " AND ".join(food_checks)

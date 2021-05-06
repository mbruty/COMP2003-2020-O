from mysql_connection import get_cursor
from FoodItem import FoodItem
import pandas as pd
import numpy as np
from user import User

column_rows = ["IsVegetarian", "IsVegan", "IsHalal", "IsKosher", "HasLactose", "HasNuts", "HasGluten", "HasEgg", "HasSoy"]


class RecommendationEngine:
    #initialiser for the class
    def __init__ (self, inFoodItems, inUsers):
        self.FoodItems = inFoodItems
        self.Users = inUsers

        for u in self.Users:
            u.print()

        for f in self.FoodItems:
            f.printInfo()

    def preprocessing (self):
        FoodItemAverage = []
        for FoodItem in self.FoodItems:
            FoodTagAverage = []
            for FoodTag in FoodItem:
                Reviews = []
                Total = 0
                for user in self.Users:
                    Reviews.append(user.GetSwipePct(FoodTag.ID))
                    Total = Total + user.GetSwipePct(FoodTag.ID)
                FoodTagAverage[FoodTag.ID] = Total/Reviews.count 
            Sum = 0
            for FoodTag in FoodTagAverage:
                Sum = Sum + FoodTag
            Average = Sum / FoodTagAverage.count
            FoodItemAverage.append(FoodItem.ID, Average)
    
def get_swipe_stack(lat, lng, userid, distance):
    print(lat)
    print(lng)
    print(userid)
    cursor = get_cursor()
    cursor.callproc("GetFoodChecksByID", (userid,))
    checks = []
    # stored_results is iterable, have to do this way
    for result in cursor.stored_results():
        checks = result.fetchall()[0][1:]
    cursor.callproc("GetRestaurantsWithinDistance", (lat, lng, 10))
    data = []

    df = None

    for result in cursor.stored_results():
        df = pd.DataFrame(result)

    if(df.size < 1):
        raise Exception("No restaurants found within specified distance")

    df.columns = ["RestaurantID", "IsVegetarian", "IsVegan", "IsHalal", "IsKosher", "HasLactose", "HasNuts", "HasGluten", "HasEgg", "HasSoy", "FoodID", "FoodName", "FoodNameShort", "IsChildMenu", "FoodTagID"]
    if checks[0]:
        df = df.drop(df[df["IsVegetarian"] != checks[0]].index)
    if checks[1]:
        df = df.drop(df[df["IsVegan"] != checks[1]].index)
    if checks[2]:
        df = df.drop(df[df["IsHalal"] != checks[2]].index)
    if checks[3]:
        df = df.drop(df[df["IsKosher"] != checks[3]].index)
    if checks[4]:
        df = df.drop(df[df["HasLactose"] != checks[4]].index)
    if checks[5]:
        df = df.drop(df[df["HasNuts"] != checks[5]].index)
    if checks[6]:
        df = df.drop(df[df["HasGluten"] != checks[6]].index)
    if checks[7]:
        df = df.drop(df[df["HasEgg"] != checks[7]].index)
    if checks[8]:
        df = df.drop(df[df["HasSoy"] != checks[8]].index)

    food_items = []
    for food_id in df.FoodID.unique():
        # For each unique food id
        # Extract that part of the dataframe, and create a new food item from it
        food_items.append(FoodItem(df[df["FoodID"] == food_id]))
    cursor.close()

    r = RecommendationEngine(food_items, getUserData(userid))
    return jsonifyFoodItemArray(food_items)

def jsonifyFoodItemArray(items):
    jsonified = "["

    for food_item in items:
        jsonified += food_item.toJson() + ","
    jsonified = jsonified[:-1] + "]"
    return jsonified

def food_checks_builder(result):
    food_checks = []
    for i in range(len(result)):
        if(result[i]):
            food_checks.append(f"{column_rows[i]}=1")
    return " AND ".join(food_checks)

def getUserData(userid):
    user_id = (userid, )
    cursor = get_cursor()
    foodchecks = cursor.callproc("GetFoodChecksByID", user_id)
    checks = []
    # stored_results is iterable, have to do this way
    for result in cursor.stored_results():
        checks = result.fetchall()[0][1:]

    cursor.execute(f"SELECT FoodTagID FROM FoodOpinionRightSwipePercent WHERE UserID={user_id[0]};")
    result = cursor.fetchall()
    food_tags = [str(i[0]) for i in result[:5] + result[-5:]] # Select top 5 and bottom 5 rated tags
    cursor.execute(f"SELECT UserID, FoodTagID, RightSwipePercent FROM FoodOpinionRightSwipePercent WHERE UserID IN(SELECT UserID FROM tat.UserFoodCheckView WHERE {food_checks_builder(checks)} AND UserID<>{user_id[0]}) AND FoodTagID IN ({','.join(food_tags)});")
    result = cursor.fetchall()
    tag_dict = {}
    cursor.execute(f"SELECT UserID, FoodTagID, RightSwipePercent FROM FoodOpinionRightSwipePercent WHERE UserID={user_id[0]};")
    user = cursor.fetchall()
    for row in user:
        tag_dict[row[1]] = float(row[2])
        ptr = 0
    count_dict = {55: 2}
    TOLERANCE = 0.3

    # Go through all results, and count how many tags are within the tolerance
    for row in result:
        user_val = tag_dict[row[1]]
        # Within the user's swipe percentage + / - 0.3
        if user_val - TOLERANCE <= row[2] <= user_val + TOLERANCE:
            try:
                count = count_dict[row[0]]
                count_dict[row[0]] = count + 1
            except:
                count_dict[row[0]] = 1

    ids_to_get = []
    for user in count_dict.items():
        if(user[1] >= 5):
            ids_to_get.append(str(user[0]))
    cursor.execute(f"SELECT UserID, FoodTagID, RightSwipePercent FROM FoodOpinionRightSwipePercent WHERE UserID IN ({','.join(ids_to_get)});")
    result = cursor.fetchall()
    df = pd.DataFrame(result)
    df.columns = ["UserID", "FoodTagID", "RightSwipePct"]
    similarities = []
    for row in df.iterrows():
        id = row[1][0]
        similarities.append(count_dict[id] / 5)

    df["Bias"] = similarities
    user_data = []
    for user_id in ids_to_get:
        # For each user id in the one's we want to get
        # Extract that part of the dataframe, and create a new user object from it
        user_data.append(User(df[df["UserID"] == int(user_id)]))

    return user_data
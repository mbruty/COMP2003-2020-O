from mysql_connection import get_cursor
from FoodItem import FoodItem
import pandas as pd
import numpy as np
from user import User
import pickle

column_rows = ["IsVegetarian", "IsVegan", "IsHalal", "IsKosher", "HasLactose", "HasNuts", "HasGluten", "HasEgg", "HasSoy"]


class RecommendationEngine:
    #initialiser for the class
    def __init__ (self, inFoodItems, inUsers, currentUser):
        self.FoodItems = inFoodItems
        self.Users = inUsers
        self.User = currentUser
        self.preprocessing()

    def recommend(self):
        results = []
        likedItems = [i.decode("UTF-8") for i in r.lrange(f"Recommendations-{self.User}", 0, -1)]
        
        # Loop through all food items in the area
        for item in self.FoodItems:
            rating = 0
            for tags in item.FoodTags:
                userRating = None
                if self.User != None:
                    userRating = self.User.getSwipePct(tags)
                if userRating == None:
                    rating += self.weightedAvg[tags]
                else:
                    rating += ( float(userRating) + self.weightedAvg[tags] ) / 2
                
            results.append((item.ID, rating / len(item.FoodTags)))


        sortedItems = sorted(results, key=lambda tup: tup[1])
        sortedItems.reverse()
        itemsToGet = sortedItems
        gotItems = []
        filteredItems = []
        for item in itemsToGet:
            for fi in self.FoodItems:
                if fi.ID == item[0]:
                    gotItems.append(fi)
        for item in gotItems:
            if item.FoodID not in likedItems:
                filteredItems.append(item)
        return filteredItems

    # Helper for the juptyer notebook
    def getFoodItems(self):
        return self.FoodItems
    
    # Helper for the juptyer notebook
    def getUsers(self):
        return self.Users

    def preprocessing (self):
        tags = []
        averages = {}
        for F in self.FoodItems:
            tags = tags + F.FoodTags
        unique = set(tags)
        for tag in unique:
            total = 0
            count = 0
            for user in self.Users:
                rating = user.getSwipePct(tag)
                if rating != None:
                    for i in range(int(user.bias) * 10):
                        total += rating
                        count += 1
            if count == 0:
                # We don't have any users like this one
                # that has rated this... So give it a slightly higher than 1
                # rating so that we can get data on it
                averages[tag] = 1.3 
            else:
                averages[tag] = total / count
        self.weightedAvg = averages
    
def get_swipe_stack(lat, lng, userid, distance):
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

    cursor.execute(f"SELECT UserID, FoodTagID, RightSwipePercent FROM FoodOpinionRightSwipePercent WHERE UserID={userid};")

    result = cursor.fetchall()
    r = None
    if len(result) == 0:
        r = RecommendationEngine(food_items, getUserData(userid), None)
    else:
        df = pd.DataFrame(result)
        df.columns = ["UserID", "FoodTagID", "RightSwipePct"]
        df["Bias"] = 1
        u = User(df[df["UserID"] == int(userid)])
        r = RecommendationEngine(food_items, getUserData(userid), u)
    got_items = r.recommend()
    cursor.close()
    return jsonifyFoodItemArray(got_items)

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
    ids_to_get = None
    count_dict = {}

    if len(result) < 10:
       # We haven't swiped on enough yet
        ids = []
        cursor.execute(f"SELECT UserID, FoodTagID, RightSwipePercent FROM FoodOpinionRightSwipePercent WHERE UserID IN(SELECT UserID FROM tat.UserFoodCheckView WHERE {food_checks_builder(checks)} AND UserID<>{user_id[0]});")
        result = cursor.fetchall()
        for row in result:
            ids.append(row[0])
        ids_to_get = list(set(ids))
    else :
        # If we have swiped on more than 10 items
        # Do :
        food_tags = [str(i[0]) for i in result[:5] + result[-5:]] # Select top 5 and bottom 5 rated tags
        cursor.execute(f"SELECT UserID, FoodTagID, RightSwipePercent FROM FoodOpinionRightSwipePercent WHERE UserID IN(SELECT UserID FROM tat.UserFoodCheckView WHERE {food_checks_builder(checks)} AND UserID<>{user_id[0]}) AND FoodTagID IN ({','.join(food_tags)});")
        result = cursor.fetchall()
        tag_dict = {}
        cursor.execute(f"SELECT UserID, FoodTagID, RightSwipePercent FROM FoodOpinionRightSwipePercent WHERE UserID={user_id[0]};")
        user = cursor.fetchall()
        for row in user:
            tag_dict[row[1]] = float(row[2])
            ptr = 0
        TOLERANCE = 0.3
        ids_to_get = None
        while True:
            ptr = 0
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

            ids = []

            for user in count_dict.items():
                if(user[1] >= 5):
                    print(user)
                    ids.append(str(user[0]))
            if len(ids) < 3:
                TOLERANCE += 0.1
                print(TOLERANCE)
            elif TOLERANCE > 1:
                ids_to_get = ids
                break
            else:
                ids_to_get = ids
                break

    ids_to_get = map(str, ids_to_get)
    cursor.execute(f"SELECT UserID, FoodTagID, RightSwipePercent FROM FoodOpinionRightSwipePercent WHERE UserID IN ({','.join(ids_to_get)});")
    result = cursor.fetchall()
    df = pd.DataFrame(result)
    df.columns = ["UserID", "FoodTagID", "RightSwipePct"]
    similarities = []
    for row in df.iterrows():
        id = row[1][0]
        if len(count_dict) != 0:
            similarities.append(count_dict[id] / 5)
        else:
            similarities.append(1)

    df["Bias"] = similarities
    user_data = []
    for user_id in ids_to_get:
        # For each user id in the one's we want to get
        # Extract that part of the dataframe, and create a new user object from it
        user_data.append(User(df.loc[df["UserID"] == int(user_id)].reset_index()))

    return user_data
from mysql_connection import get_cursor
from FoodItem import FoodItem
import pandas as pd

class RecommendationEngine:
    #initialiser for the class
    def __init__ (self, inFoodItems, inUsers):
        self.FoodItems = inFoodItems
        self.Users = inUsers

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
    cursor = get_cursor()
    cursor.callproc("GetFoodChecksByID", (userid,))
    checks = []
    # stored_results is iterable, have to do this way
    for result in cursor.stored_results():
        checks = result.fetchall()[0][1:]
    cursor.callproc("GetRestaurantsWithinDistance", (lat, lng, distance))
    data = []

    df = None

    for result in cursor.stored_results():
        df = pd.DataFrame(result)
    
    if(df.size < 1):
        raise Exception("No restaurants found within specified distance")

    print(df.head())
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
    return jsonifyFoodItemArray(food_items)

def jsonifyFoodItemArray(items):
    jsonified = "["

    for food_item in items:
        jsonified += food_item.toJson() + ","
    jsonified = jsonified[:-1] + "]"
    return jsonified
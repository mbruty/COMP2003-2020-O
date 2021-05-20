import json

class FoodItem:
    #initialiser for the class
    def __init__(self, df):
        self.RestaurantID = df["RestaurantID"].iloc[0].item()
        self.Price = df["Price"].iloc[0]
        self.ID = df["FoodID"].iloc[0].item()
        self.FoodTags = []
        self.Name = df["FoodName"].iloc[0]
        self.ShortName = df["FoodNameShort"].iloc[0]
        for index, row in df.iterrows():
            self.FoodTags.append(row["FoodTagID"])
            
    
    #prints all relevant info stored on the class (for testing)
    def printInfo(self):
        print("ID: " + str(self.ID) + " - (" + str(type(self.ID)) + ")")
        print("FoodTags: " + str(self.FoodTags) + " - (" + str(type(self.FoodTags)) + ")")
        print("Restaurant ID: " + str(self.RestaurantID))

    #adds a new foodtag
    def addFoodTag(self, newFoodTag):
        self.FoodTags.add(newFoodTag)

    def toJson(self):
        return json.dumps({"FoodID": self.ID, "RestaurantID": self.RestaurantID, "Name": self.Name, "ShortName": self.ShortName, "Price": str(self.Price)}, default=lambda o: o.dict, sort_keys=True, indent=4)


class FoodRecommendation:
    def __init__(self, restaurantID, avgRating):
        self.restaurantID = restaurantID
        self.avgRating = avgRating

#CLASS TESTING CODE
#Burger = FoodItem(1, { 1, 2, 3})
#Burger.printInfo()
#Burger.addFoodTag(3)
#Burger.printInfo()
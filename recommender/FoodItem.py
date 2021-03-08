class FoodItem:
    #initialiser for the class
    def __init__(self, df):
        self.RestaurantID = df["RestaurantID"].iloc[0]
        self.ID = df["FoodID"].iloc[0]
        self.FoodTags = []
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



#CLASS TESTING CODE
#Burger = FoodItem(1, { 1, 2, 3})
#Burger.printInfo()
#Burger.addFoodTag(3)
#Burger.printInfo()
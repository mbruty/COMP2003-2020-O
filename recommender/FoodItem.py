class FoodItem:
    def __init__(self, inID, inFoodTags):
        self.ID = inID
        self.FoodTags = inFoodTags
        
    def printInfo(self):
        print("ID: " + str(self.ID) + " - (" + str(type(self.ID)) + ")")
        print("FoodTags: " + str(self.FoodTags) + " - (" + str(type(self.FoodTags)) + ")")

    def addFoodTag(self, newFoodTag):
        self.FoodTags.add(newFoodTag)

#CLASS TESTING CODE
#Burger = FoodItem(1, { 1, 2, 3})
#Burger.printInfo()
#Burger.addFoodTag(4)
#Burger.printInfo()
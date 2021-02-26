class FoodItem:
    #initialier for the class
    def __init__(self, inID, inFoodTags):
        self.ID = inID
        self.FoodTags = inFoodTags
    
    #prints all relevant info stored on the class (for testing)
    def printInfo(self):
        print("ID: " + str(self.ID) + " - (" + str(type(self.ID)) + ")")
        print("FoodTags: " + str(self.FoodTags) + " - (" + str(type(self.FoodTags)) + ")")

    #adds a new foodtag
    def addFoodTag(self, newFoodTag):
        self.FoodTags.add(newFoodTag)



#CLASS TESTING CODE
#Burger = FoodItem(1, { 1, 2, 3})
#Burger.printInfo()
#Burger.addFoodTag(3)
#Burger.printInfo()
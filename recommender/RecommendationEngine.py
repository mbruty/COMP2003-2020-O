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

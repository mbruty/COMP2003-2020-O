class RecommendationEngine:
    #initialiser for the class
    def __init__ (self, inFoodItems, inUsers):
        self.FoodItems = inFoodItems
        self.Users = inUsers
<<<<<<< Updated upstream
=======
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
        for item in itemsToGet:
            for fi in self.FoodItems:
                if fi.ID == item[0]:
                    gotItems.append(fi)
        filteredItems = []
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
>>>>>>> Stashed changes

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

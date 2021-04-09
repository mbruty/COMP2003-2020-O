from redis_instance import get_instance
r = get_instance()

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

    #def swipeoptions():
        #GetRedis()
        #Create SwipeStack
        #if len(recommendations) == 0:
        #    raise Exception("No items left") 

    #def processing (self):
        # MAKE RECOMMENDATIONS
        # RedisPush()



    def RedisPush (self, UserID, RecommendedItems):
        r.lpush(f"Recommendations-{UserID}", *RecommendedItems)
        r.expire(f"Recommendations-{UserID}", 7200)

    def GetRedis (self, UserID):
        return [i.decode("UTF-8") for i in r.lrange(f"Recommendations-{UserID}", 0, -1)]


# CLASS TESTING
# List = [1,3,5,7,9]
# FoodItems = [1,2,3,4,5]
# Users = [2,4,6,8,10]
# re = RecommendationEngine(FoodItems, Users)
# re.RedisPush(1, List)
# print (re.GetRedis(1))

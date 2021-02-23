class User:
    user_id = None
    top_five_likes = []
    top_five_dislikes = []

    def __init__(self, top_five_likes, top_five_dislikes):

        self.user_id = top_five_likes["UserID"].iloc[0]

        for i in range(len(top_five_dislikes)):

            curr_like = top_five_likes.iloc[i]
            curr_dislike = top_five_dislikes.iloc[i]

            self.top_five_likes.append((curr_like.FoodTagID, float(curr_like.RightSwipePercent)))
            self.top_five_dislikes.append((curr_dislike.FoodTagID, float(curr_dislike.RightSwipePercent)))
            
    @staticmethod
    def help():
        print("top_five_(dis)likes: tuple ( FoodTagID, RightSwipePercent )")
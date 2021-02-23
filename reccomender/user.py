class User:
	user_id = None
	top_five_likes = []
	top_five_dislikes = []

	def __init__(self, top_five_likes, top_five_dislikes, skip, id=0):

		# This is just for Jack's testing, once we've got all the data in the sql server, this will be removed
		if skip:
			self.user_id = id
			self.top_five_likes = top_five_likes
			self.top_five_dislikes = top_five_dislikes
		else:
			self.user_id = top_five_likes["UserID"].iloc[0]
			temp_likes = []
			temp_dislikes = []
			for i in range(len(top_five_dislikes)):
				curr_like = top_five_likes.iloc[i]
				curr_dislike = top_five_dislikes.iloc[i]

				temp_likes.append(
					(curr_like.FoodTagID, float(curr_like.RightSwipePercent)))
				temp_dislikes.append(
					(curr_dislike.FoodTagID, float(curr_dislike.RightSwipePercent)))
					
			self.top_five_likes = temp_likes
			self.top_five_dislikes = temp_dislikes

	@staticmethod
	def help():
		print("top_five_(dis)likes: tuple ( FoodTagID, RightSwipePercent )")

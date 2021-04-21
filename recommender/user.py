import FoodItem

class User:
    def __init__(self, df):
        self.id = df["UserID"][0]
        self.bias = df["Bias"][0]
        self.food_tags = []
        for index, row in df.iterrows():
            self.food_tags.append([row["FoodTagID"], row["RightSwipePct"]])

    def print(self):
        print(f"ID: {self.id} \t Bias: {self.bias} \nFood Tags: {self.food_tags}")
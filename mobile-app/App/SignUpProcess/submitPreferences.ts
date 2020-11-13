import { API_URL } from "../constants";
import { IData } from "../shared/IData";

export const submitPreferences = (
  data: IData,
  userId: string,
  authToken: string
) => {
  return new Promise((resolve, reject) => {
    fetch(API_URL + "/modify/user/foods", {
      method: "PUT",
      // Mapping the items in the array to their appropriate fields in the database
      // Need the exact name for it to work with auto mysql
      headers: {
        IsVegan: data.food[0].toString(),
        IsVegetarian: data.food[0].toString(),
        IsHallal: data.food[4].toString(),
        IsKosher: data.food[5].toString(),
        ContainsLactose: data.allergies[0].toString(),
        ContainsNut: data.allergies[1].toString(),
        ContainsGluten: data.allergies[2].toString(),
        ContainsSoy: data.allergies[3].toString(),
        ContainsEgg: data.allergies[4].toString(),
        authtoken: authToken,
        userId: userId,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve();
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
};

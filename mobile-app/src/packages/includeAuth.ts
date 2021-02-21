import AsyncStorage from "@react-native-async-storage/async-storage";

export interface auth {
  authtoken: string;
  userid: string;
}

export const includeAuth = async () => {
  const data = await AsyncStorage.getItem("AUTH");
  const authData: auth = JSON.parse(data);
  return authData;
};

export const saveAuth = async (data: auth) => {
  await AsyncStorage.setItem(
    "AUTH",
    JSON.stringify({ authtoken: data.authtoken, userid: data.userid })
  );
};

export const reset = async () => {
  await AsyncStorage.removeItem("AUTH");
};

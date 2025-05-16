import * as SecureStore from "expo-secure-store";

export const setAccessToken = async (token: string) => {
  await SecureStore.setItemAsync("accessToken", token);
};

export const getAccessToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync("accessToken");
};

export const removeAccessToken = async () => {
  await SecureStore.deleteItemAsync("accessToken");
};

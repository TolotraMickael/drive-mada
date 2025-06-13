import AsyncStorage from "@react-native-async-storage/async-storage";

export const Storage = {
  set: async (key: string, value: number | string | boolean | object) => {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  },
  get: async (key: string) => {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue !== null ? JSON.parse(jsonValue) : null;
  },
  delete: async (key: string) => {
    await AsyncStorage.removeItem(key);
  },
};

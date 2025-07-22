import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'saved_portal';

export const savePortal = async (portal: { url: string; username: string; password: string }) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(portal));
};

export const loadPortal = async () => {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : null;
};

export const clearPortal = async () => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};

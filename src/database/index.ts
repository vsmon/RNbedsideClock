import AsyncStorage from "@react-native-async-storage/async-storage";
import tostMessage from "../Utils/ToastMessage";
import { StoredData } from "../Types";

async function storeData(key: string, value: StoredData): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));

    return true;
  } catch (e) {
    // saving error
    console.log("Ocorreu um erro ao salvar os dados", e);
    return false;
  }
}
async function mergeData(key: string, value: StoredData): Promise<boolean> {
  try {
    await AsyncStorage.mergeItem(key, JSON.stringify(value));

    return true;
  } catch (e) {
    // saving error
    console.log("Ocorreu um erro ao salvar os dados", e);
    return false;
  }
}

async function getStoredData(key: string): Promise<StoredData> {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      const json: StoredData = await JSON.parse(value);

      return await Promise.resolve(json);
    } else {
      return { error: { message: "No data found" } };
    }
  } catch (e: any) {
    console.log("Ocorreu um erro ao obter os dados armazenados", e);
    return { error: { message: `Error trying get data: ${e}` } };
  }
}

export { storeData, getStoredData, mergeData };

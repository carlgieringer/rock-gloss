import {AsyncStorage} from 'react-native'

export default class AppStorage {
  
  static storageKeyPrefix = "RockGloss."
  static termMeasurementsStorageKey = AppStorage.storageKeyPrefix + 'termMeasurements'
  static appHasEverLoadedStorageKey = AppStorage.storageKeyPrefix + 'appHasEverLoaded'
  static missing = {}
  
  static clear = async () => {
    const allKeys = await AsyncStorage.getAllKeys()
    await AsyncStorage.multiRemove(allKeys)
  }
  
  static getItemsAsync = async (keys) => {
    let itemPairs = null;
    try {
      itemPairs = await AsyncStorage.multiGet(keys)
    } catch(e) {
      console.log("Error reading storage", e);
      throw(e)
    }
    const items = {}
    for (let itemPair of itemPairs) {
      const value = itemPair[1];
      if (value !== null) {
        const itemKey = itemPair[0];
        items[itemKey] = JSON.parse(value);
      }
    }
    return items;
  }
  
  static getItemAsync = async (key) => {
    let valueJson = null;
    try {
      valueJson = await AsyncStorage.getItem(key)
    } catch (e) {
      console.error("Error getting item", e);
      throw(e);
    }
    if (valueJson === null) {
      return AppStorage.missing;
    }
    return JSON.parse(valueJson);
  }

  static setItemAsync = async (key, value) => {
    const valueJson = JSON.stringify(value)
    try {
      await AsyncStorage.setItem(key, valueJson);
    } catch (e) {
      console.log("Error storing term measurements", e);
      throw(e);
    }
  }
}

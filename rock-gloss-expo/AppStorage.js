import {AsyncStorage} from 'react-native'
import Errors from './Errors'

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
    } catch (err) {
      Errors.onException(err, "Error reading storage");
      throw(err)
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
    } catch (err) {
      Errors.onException(err, "Error getting item");
      throw(err);
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
    } catch (err) {
      Errors.onException(err, "Error storing term measurements");
      throw(err);
    }
  }
}

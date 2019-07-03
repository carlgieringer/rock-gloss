import {AsyncStorage} from 'react-native'

export default class AppStorage {
  
  static termMeasurementsStorageKey = 'RockGloss.termMeasurements'
  static missing = {}
  
  static clear = async () => {
    const allKeys = await AsyncStorage.getAllKeys()
    await AsyncStorage.multiRemove(allKeys)
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

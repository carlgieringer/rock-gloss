 import {AsyncStorage} from 'react-native'
 
 import AppStorage from './AppStorage'

export default class AppSettings {
  
  static settingsLoadedPromise = null;
  static settings = null;

  static storageKeyPrefix = "RockGloss.Settings."
  static adsEnabledStorageKey = AppSettings.storageKeyPrefix + "adsEnabled";
  
  static loadSettingsAsync = async () => {
      AppSettings.settingsLoadedPromise = new Promise(async (resolve, reject) => {
        let settingPairs = null;
        try {
          settingPairs = await AsyncStorage.multiGet([AppSettings.adsEnabledStorageKey])
        } catch(e) {
          console.log("Error reading settings", e);
          reject(e)
        }
        const settings = {}
        for (let settingPair of settingPairs) {
          const value = settingPair[1];
          if (value !== null) {
            const storageKey = settingPair[0];
            const settingKey = AppSettings._toSettingKey(storageKey);
            settings[settingKey] = JSON.parse(value);
          }
          
        }
        AppSettings.settings = settings;
        resolve(settings);
      });
  }
  
  static getSettingsAsync = async () => {
    if (!AppSettings.settings) {
      if (!AppSettings.settingsLoadedPromise) {
        throw new Error("Cannot get settings if loadSettingsAsync hasn't been called.")
      }
      await AppSettings.settingsLoadedPromise;
    }
    return AppSettings.settings;
  }

  static storeSettingAsync = async (key, value) => {
    try {
      await AppStorage.setItemAsync(key, value);
      const settingKey = AppSettings._toSettingKey(key)
      AppSettings.settings[settingKey] = value;
    } catch(e) {
      console.log("Error storing term measurements", e);
      throw(e);
    }
  }
  
  static _toSettingKey = (storageKey) => {
    return storageKey.substr(AppSettings.storageKeyPrefix.length)
  }
}
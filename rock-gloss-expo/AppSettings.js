 import _map from 'lodash/fp/map'
 import _compose from 'lodash/fp/compose'
 import _values from 'lodash/fp/values'
 import _mapKeys from 'lodash/mapKeys'
 
 import AppStorage from './AppStorage'

export default class AppSettings {
  
  static _settings = null;

  static _storageKeyPrefix = "RockGloss.Settings."
  static _toStorageKey = (settingKey) => AppSettings._storageKeyPrefix + settingKey
  static _toSettingKey = (storageKey) => storageKey.substr(AppSettings._storageKeyPrefix.length)
  static settingKeys = {
    adsEnabled: "adsEnabled",
    analyticsEnabled: "analyticsEnabled",
  }
  static _allSettingsStorageKeys = _compose(
    _values,
    _map(AppSettings._toStorageKey),
  )(AppSettings.settingKeys)
  
  static loadSettingsAsync = async () => {
    let settings = null;
    try {
      settings = await AppStorage.getItemsAsync(AppSettings._allSettingsStorageKeys)
    } catch(e) {
      console.log("Error getting settings", e);
      reject(e)
    }
    return _mapKeys(settings, (value, key) => AppSettings._toSettingKey(key))
  }
  
  static getSettingsAsync = async () => {
    if (!AppSettings._settings) {
      AppSettings._settings = await AppSettings.loadSettingsAsync();
    }
    return AppSettings._settings;
  }

  static setSettingAsync = async (settingKey, value) => {
    try {
      const storageKey = AppSettings._toStorageKey(settingKey)
      await AppStorage.setItemAsync(storageKey, value);
      AppSettings._settings[settingKey] = value;
    } catch(e) {
      console.log("Error storing setting", e);
      throw(e);
    }
  }
}

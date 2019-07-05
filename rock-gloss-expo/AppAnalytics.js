import { Platform } from 'react-native';
import * as Amplitude from 'expo-analytics-amplitude';

import conf from './conf/conf.json'
import AppSettings from './AppSettings'
import AppStorage from './AppStorage'

export default class AppAnalytics {
  
  static eventNames = {
    appLoad: "appLoad",
    disableAds: "disableAds",
    disableAnalytics: "enableAnalytics",
    enableAds: "enableAds",
    enableAnalytics: "enableAnalytics",
    firstAppLoad: "firstAppLoad",
    viewScreen: "viewScreen",
  }
  
  static _defaultProperties = {
    os: Platform.OS,
    osVersion: Platform.Version,
  }
  
  static _enabled = true
  static _initialized = false
  
  static _initialize = async () => {
    if (AppSettings._initialized) return
    
    AppSettings.getSettingsAsync().then((settings) => {
      AppAnalytics._enabled = settings.analyticsEnabled
    })
    
    if (!AppAnalytics._enabled) return
    
    const apiKey = conf.amplitude.apiKey
    await Amplitude.initialize(apiKey)
    
    AppSettings._initialized = true
  }
  
  static appLoad = async () => {
    await AppAnalytics._initialize()
    if (!AppAnalytics._enabled) return
    await Promise.all([
      AppAnalytics._maybeFirstAppLoad(),
      AppAnalytics.track(AppAnalytics.eventNames.appLoad)
    ])
  }
  
  static _maybeFirstAppLoad = async () => {
    if (!AppAnalytics._enabled) return
    const appHasEverLoaded = await AppStorage.getItemAsync(AppStorage.appHasEverLoadedStorageKey)
    if (!appHasEverLoaded) {
      try {
        await AppAnalytics.track(AppAnalytics.eventNames.firstAppLoad)
        await AppStorage.setItemAsync(AppStorage.appHasEverLoadedStorageKey, true)
      } catch (e) {
        console.error("error tracking firstAppLoad or storing appHasEverLoaded")
        await AppStorage.setItemAsync(AppStorage.appHasEverLoadedStorageKey, false)
      }
    }
  }
  
  static track = async (eventName, properties=null) => {
    await AppAnalytics._initialize()
    if (!AppAnalytics._enabled) return
    if (properties) {
      properties = {...AppAnalytics._defaultProperties, properties}
    } else {
      properties = AppAnalytics._defaultProperties
    }
    await Amplitude.logEventWithProperties(eventName, properties)
  }
}

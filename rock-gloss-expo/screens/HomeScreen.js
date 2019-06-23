import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';
import { DrawerActions } from 'react-navigation-drawer';
import { AdMobBanner } from 'expo-ads-admob';

import TermList from '../views/TermList'
import terms from '../assets/files/terms.json';

export default class HomeScreen extends React.Component {
  render() {
    const adUnitId = __DEV__ ?
      "ca-app-pub-3940256099942544/6300978111" :
      "ca-app-pub-6354515522629884/7406192128"
    return (
      <View style={styles.container}>
        <TermList terms={terms} />
        <AdMobBanner
          bannerSize="fullBanner"
          adUnitID={adUnitId}
          testDeviceID="EMULATOR"
          onDidFailToReceiveAdWithError={this.bannerError} />
      </View>
    );
  }
  
  bannerError = () => {
    console.log("bannerError")
  }
  
  adMobEvent = () => {
    console.log("adMobEvent")
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';
import { DrawerActions } from 'react-navigation-drawer';
import { AdMobBanner } from 'expo-ads-admob';
import _orderBy from 'lodash/fp/orderBy';
import _deburr from 'lodash/deburr';

import TermList from '../views/TermList'
import terms from '../assets/files/terms.json';

const adMobTestAdUnitId = "ca-app-pub-3940256099942544/6300978111"
const rockGlossBannerAdUnitId = "ca-app-pub-6354515522629884/7406192128"

export default class HomeScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      showAd: true,
    }
  }
  render() {
    const {
      showAd
    } = this.state
    const adUnitId = __DEV__ ? adMobTestAdUnitId : rockGlossBannerAdUnitId
    const orderedTerms = _orderBy(sortTermsIteratee)(['asc'])(terms)
    return (
      <View style={styles.container}>
        <TermList terms={orderedTerms} />
        {showAd && (
          <AdMobBanner
            bannerSize="fullBanner"
            adUnitID={adUnitId}
            testDeviceID={AdMobBanner.simulatorId}
            onAdViewDidReceiveAd={this.onAdViewDidReceiveAd}
            onDidFailToReceiveAdWithError={this.onDidFailToReceiveAdWithError}
          />
        )}
      </View>
    );
  }

  onAdViewDidReceiveAd = () => {
    this.setState({
      showAd: true
    })
  }

  onDidFailToReceiveAdWithError = (error) => {
    // console.error("bannerError", error)
    this.setState({
      showAd: false
    })
  }
}

function sortTermsIteratee(term) {
  const title = _deburr(term.title);
  // We want to sort words like "b"-grade and 'scend starting with their second letter
  if (title.startsWith('"') || title.startsWith("'")) {
    return title.substr(1);
  }
  return title;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

import React from 'react';
import {ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Switch, Text, View} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import Link from '../components/Link'
import AppSettings from '../AppSettings'
import AppStorage from '../AppStorage'
import AppAnalytics from '../AppAnalytics'
import Paragraph from './AboutScreen'
import ScreenNavigationAnalytics from '../components/ScreenNaviationAnalytics'


export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };
  
  constructor(props) {
    super(props);
    this.state = {
      settings: {
        adsEnabled: true,
        analyticsEnabled: true,
      },
      settingsLoaded: false,
    }
  }

  render() {
    const {
      settings: {
        adsEnabled,
        analyticsEnabled,
      },
      settingsLoaded,
    } = this.state
    
    const bullet = '\u2022'
    const settingsControls = settingsLoaded ? [
      <Section key="disclaimer:">
        <Text>Must restart app for settings to take affect.</Text>
      </Section>,
      <Section key="ads-enabled">
        <Text style={styles.settingLabel}>Ads Enabled: </Text>
        <Switch value={adsEnabled} onValueChange={this.onAdsEnabledChange} />
        <Text style={styles.smallText}>
          <Text>All revenue from RockGloss donated to </Text>
          <Link href="https://www.accessfund.org/">AccessFund</Link>
          <Text>; please consider donating.</Text>
        </Text>
      </Section>,
      <Section key="analytics">
        <Text style={styles.settingLabel}>Analytics Enabled: </Text>
        <Switch value={analyticsEnabled} onValueChange={this.onAnalyticsEnabledChange} />
        <Text>
          The analytics measured in this app are: first app open, app open, 
          view screen (Terms, About, Settings), disable ads, disable analytics
        </Text>
      </Section>,
    ] : (
      <View>
        <Text>Loading settings...</Text>
        <ActivityIndicator
          color="black"
          size="large"
          style={styles.loadingIndicator}
        />
      </View>
    )
    return (
      <ScrollView style={styles.container}>
        {settingsControls}
        <Section>
          <Button title="Reset App" onPress={this.onPressResetApp} />
        </Section>
        <ScreenNavigationAnalytics screenName="settings" />
      </ScrollView>
    );
  }

  componentDidMount = () => {
    AppSettings.getSettingsAsync().then((settings) => this.setState({
      settings: {...this.state.settings, ...settings},
      settingsLoaded: true,
    }))
  }

  onPressResetApp = (event) => {
    AppStorage.clear()
      .then(() => {
        Alert.alert("Success", "App settings reset")
      })
      .catch((errors) => {
        Alert.alert("Error", "Unable to reset settings")
      })
  }

  onAdsEnabledChange = async (newValue) => {
    const eventName = newValue ? AppAnalytics.eventNames.enableAds : AppAnalytics.eventNames.disableAds
    await Promise.all([
      AppSettings.setSettingAsync(AppSettings.settingKeys.adsEnabled, newValue),
      AppAnalytics.track(eventName),
    ])
    this.setState({
      ...this.state,
      settings: {
      ...this.state.settings,
      adsEnabled: newValue,
    }})
  }

  onAnalyticsEnabledChange = async (newValue) => {
    const eventName = newValue ? AppAnalytics.eventNames.enableAnalytics : AppAnalytics.eventNames.disableAnalytics
    await Promise.all([
      AppSettings.setSettingAsync(AppSettings.settingKeys.analyticsEnabled, newValue),
      AppAnalytics.track(eventName),
    ])
    this.setState({
      ...this.state,
      settings: {
        ...this.state.settings,
        analyticsEnabled: newValue,
      }
    })
  }
}

class Section extends React.Component {
  render() {
    return (
      <View style={styles.section}>
        {this.props.children}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  link: {
    textDecorationLine: 'underline',
  },
  loadingIndicator: {},
  smallText: {
    fontSize: RFValue(12),
  },
  section: {
    marginBottom: 12,
  },
  settingLabel: {
    fontWeight: 'bold',
  },
});

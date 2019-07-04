import React from 'react';
import {ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Switch, Text, View} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import Link from '../components/Link'
import AppSettings from '../AppSettings'
import AppStorage from '../AppStorage'


export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };
  
  constructor(props) {
    super(props);
    this.state = {
      settings: {
        adsEnabled: true
      },
      settingsLoaded: false,
    }
  }

  render() {
    const {
      settings: {
        adsEnabled
      },
      settingsLoaded,
    } = this.state
    const settingsControls = settingsLoaded ? [
      <Section key="disclaimer:">
        <Text>Must restart app for settings to take affect.</Text>
      </Section>,
      <Section key="ads-enabled">
        <Text>Ads Enabled: </Text>
        <Switch value={adsEnabled} onValueChange={this.onPressDisableAds} />
        <Text style={styles.smallText}>
          <Text>All revenue for RockGloss donated to </Text>
          <Link href="https://www.accessfund.org/">AccessFund</Link>
          <Text>; please consider donating.</Text>
        </Text>
      </Section>
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
        <Section>
          <Text>Reset app: </Text>
          <Button title="Reset App" onPress={this.onPressResetApp} />
        </Section>
        {settingsControls}
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

  onPressDisableAds = (newValue) => {
    AppSettings.setSettingAsync(AppSettings.adsEnabledSettingKey, newValue)
      .then(() => this.setState({settings: {
        ...this.state, 
        adsEnabled: newValue
      }}))
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
});

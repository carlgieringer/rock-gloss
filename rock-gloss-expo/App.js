import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { useScreens } from 'react-native-screens';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset'
import * as Font from 'expo-font'
import * as Icon from '@expo/vector-icons'
import AppContainer from './navigation/AppContainer';
import AppSettings from './AppSettings'
import AppAnalytics from './AppAnalytics'

useScreens();
AppSettings.loadSettingsAsync()
AppAnalytics.appLoad()

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppContainer />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

import React from 'react';
import {Alert, AsyncStorage, Button, ScrollView, StyleSheet, Switch, Text, View} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import Link from '../components/Link'


export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Section>
          <Text>Reset app: </Text>
          <Button title="Reset App" onPress={this.onPressResetApp} />
        </Section>
      </ScrollView>
    );
  }

  onPressResetApp = (event) => {
    AsyncStorage.getAllKeys()
      .then((allKeys) => {
        return AsyncStorage.multiRemove(allKeys)
      })
      .then(() => {
        Alert.alert("Success", "App settings reset")
      })
      .catch((errors) => {
        Alert.alert("Error", "Unable to reset settings")
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
  section: {
    marginBottom: 12,
  }
});

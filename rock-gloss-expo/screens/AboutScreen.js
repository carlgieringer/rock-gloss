import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {WebBrowser} from 'expo'

import Link from '../components/Link'


export default class AboutScreen extends React.Component {
  static navigationOptions = {
    title: 'About',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.paragraph}>
          <Text>A rock climbing glossary offered by </Text>
          <Link href="https://twitter.com/carlgieringer">
            Carl Gieringer
          </Link>
          <Text>.</Text>
        </Text>
        <Text style={styles.paragraph}>
          Dedicated to all who wander and find themselves just remembering to breathe while hanging from a rock face.
        </Text>
        <Text style={styles.paragraph}>
          <Text>Source code for this app is </Text> 
          <Link href="https://github.com/carlgieringer/rock-gloss">
            available on Github
          </Link>
          <Text>.</Text>
        </Text>
        <Text style={styles.paragraph}>
          <Link href="https://thenounproject.com/term/carabiner/191349">
            Carabiner
          </Link>
          <Text> by JEREMIE SOMMET from the Noun Project</Text>
        </Text>
        <Text style={styles.paragraph}>
          <Text>All revenue from this app is donated to </Text>
          <Link href="https://www.accessfund.org/">
            AccessFund
          </Link>
          <Text>.</Text>
        </Text>
        
        <Text>
          <Text>Is this glossary missing your favorite rock climbing term? </Text>
          <Link href="https://forms.gle/a6GuRoxt7Ls7NSpC8">
            Suggest a term for RockGloss
          </Link>
          <Text>!</Text>
        </Text>
      </ScrollView>
    );
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
  paragraph: {
    marginBottom: 10,
  },
});

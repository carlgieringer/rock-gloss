import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {WebBrowser} from 'expo'

import Link from '../components/Link'
import appInfo from '../app.json'
import Paragraph from '../components/Paragraph'
import ScreenNavigationAnalytics from '../components/ScreenNaviationAnalytics'


export default class AboutScreen extends React.Component {
  static navigationOptions = {
    title: 'About',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Paragraph>
          <Text>A rock climbing glossary offered by </Text>
          <Link href="https://twitter.com/carlgieringer">
            Carl Gieringer
          </Link>
          <Text>.</Text>
        </Paragraph>
        <Paragraph>
          Dedicated to all who wander and find themselves just remembering to breathe while hanging from a rock face.
        </Paragraph>
        <Paragraph>
          <Text>Terms initially sourced from Wikipedia&rsquo;s </Text>
          <Link href="https://en.wikipedia.org/wiki/Glossary_of_climbing_terms">
            glossary of climbing terms
          </Link>
          <Text>.</Text>
        </Paragraph>
        <Paragraph>
          <Text>Source code for this app is </Text> 
          <Link href="https://github.com/carlgieringer/rock-gloss">
            available on Github
          </Link>
          <Text>.</Text>
        </Paragraph>
        <Paragraph>
          <Link href="https://thenounproject.com/term/carabiner/191349">
            Carabiner
          </Link>
          <Text> by JEREMIE SOMMET from the Noun Project</Text>
        </Paragraph>
        <Paragraph>
          <Text>Google Play Feature Graphic Photo derived from </Text>
          <Link href="https://unsplash.com/photos/HKMjPUC_flk">
            photo by Tommy Lisbin on Unsplash
          </Link>
          <Text>.</Text>
        </Paragraph>
        <Paragraph>
          <Text>All revenue from this app is donated to </Text>
          <Link href="https://www.accessfund.org/">
            AccessFund
          </Link>
          <Text>.</Text>
        </Paragraph>
        <Paragraph>
          <Text>Is this glossary missing your favorite rock climbing term? </Text>
          <Link href="https://forms.gle/a6GuRoxt7Ls7NSpC8">
            Suggest a term for RockGloss
          </Link>
          <Text>!</Text>
        </Paragraph>
        <Paragraph>
          Version: {appInfo.expo.version}
        </Paragraph>
        <Paragraph>
          <Text>Alphabetical scroll bar adapted from </Text>
          <Link href="https://github.com/bardog/Alpha-scroll-flat-list">bardog/Alpha-scroll-flat-list</Link>
          <Text>.</Text>
        </Paragraph>
        <Paragraph>
          <Text>List height measurer derived from </Text>
          <Link href="https://github.com/Ashoat/squadcal/blob/master/native/text-height-measurer.react.js">Ashoat/squadcal</Link>
          <Text>.</Text>
        </Paragraph>
        <Paragraph>
          <Text>Your usage of this app is governed by </Text>
          <Link href="https://github.com/carlgieringer/rock-gloss/blob/master/TERMS.md">Terms of Use</Link>
          <Text>, a </Text>
          <Link href="https://github.com/carlgieringer/rock-gloss/blob/master/PRIVACY.md">Privacy Policy</Link>
          <Text>, and a </Text>
          <Link href="https://github.com/carlgieringer/rock-gloss/blob/master/DISCLAIMER.md">Disclaimer</Link>
          <Text>.</Text>
        </Paragraph>
        <ScreenNavigationAnalytics screenName="about" />
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
});

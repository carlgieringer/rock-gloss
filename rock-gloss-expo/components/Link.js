import {WebBrowser} from 'expo'
import PropTypes from 'prop-types'
import React from 'react'
import {StyleSheet, Text} from 'react-native'

export default class Link extends React.Component {
  static propTypes = {
    href: PropTypes.string
  }

  render() {
    return (
      <Text
        onPress={this.onPress}
        style={styles.link}
      >
        {this.props.children}
      </Text>
    )
  }

  onPress = () => {
    WebBrowser.openBrowserAsync(this.props.href)
  }
}

const styles = StyleSheet.create({
  link: {
    textDecorationLine: 'underline',
  },
})

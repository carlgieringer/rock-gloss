import React from 'react'
import {StyleSheet, Text} from 'react-native'


export default class Paragraph extends React.Component {
  render() {
    return (
      <Text style={styles.paragraph}>
        {this.props.children}
      </Text>
    )
  }
}

const styles = StyleSheet.create({
  paragraph: {
    marginBottom: 10,
  },
});

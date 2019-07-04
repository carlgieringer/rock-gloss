import React from 'react'
import PropTypes from 'prop-types'
import {NavigationEvents} from 'react-navigation'

import AppAnalytics from '../AppAnalytics'

export default class ScreenNavigationAnalytics extends React.Component {
  
  static propTypes = {
    screenName: PropTypes.string.isRequired,
  }
  
  render() {
    return (
      <NavigationEvents onDidFocus={this.onDidFocus} />
    )
  }
  
  // payload reference: https://reactnavigation.org/docs/en/navigation-prop.html#addlistener-subscribe-to-updates-to-navigation-lifecycle
  onDidFocus = (payload) => {
    AppAnalytics.track(AppAnalytics.eventNames.viewScreen, {
      screenName: this.props.screenName,
    })
  }
}
import React from 'react';
import {Platform} from 'react-native'
import { Icon } from 'expo';
import { FontAwesome } from '@expo/vector-icons';

import Colors from '../constants/Colors';

// This is supposed to be a library for achieving cross-platform menu buttons:
// https://github.com/vonovak/react-navigation-header-buttons
export default class MenuIcon extends React.Component {
  render() {
    return (
      <Icon.Ionicons
        name={
          Platform.OS === 'ios'
            ? `ios-menu`
            : 'md-menu'
        }
        size={26}
        color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
  }
}

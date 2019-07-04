import {createStackNavigator, createDrawerNavigator} from 'react-navigation'
import HomeScreen from '../screens/HomeScreen'
import React from 'react'
import AboutScreen from '../screens/AboutScreen'
import MenuIcon from '../components/MenuIcon'
import {TouchableOpacity} from 'react-native'
import SettingsScreen from '../screens/SettingsScreen'

const defaultNavigationOptions = ({navigation}) => ({
  title: "RockGloss",
  headerStyle: {
    backgroundColor: '#2f6888',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerLeft: (
    <TouchableOpacity transparent onPress={() => navigation.toggleDrawer()}>
      <MenuIcon />
    </TouchableOpacity>
  ),
  headerLeftContainerStyle: {
    marginLeft: 15,
  },
})

const HomeStack = createStackNavigator({
  HomeScreen,
}, {
  defaultNavigationOptions
})

const AboutStack = createStackNavigator({
  AboutScreen,
}, {
  defaultNavigationOptions
})

const SettingsStack = createStackNavigator({
  SettingsScreen,
}, {
  defaultNavigationOptions
})

export default createDrawerNavigator({
  Terms: HomeStack,
  About: AboutStack,
  Settings: SettingsStack,
})

import {createStackNavigator, createDrawerNavigator} from 'react-navigation'
import HomeScreen from '../screens/HomeScreen'
import React from 'react'
import AboutScreen from '../screens/AboutScreen'
import MenuIcon from '../components/MenuIcon'
import {TouchableOpacity} from 'react-native'

const defaultNavigationOptions = ({navigation}) => ({
  title: "RockGloss",
  headerStyle: {
    backgroundColor: '#2f6888',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerRight: (
    <TouchableOpacity transparent onPress={() => navigation.toggleDrawer()}>
      <MenuIcon />
    </TouchableOpacity>
  ),
  headerRightContainerStyle: {
    marginRight: 15,
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

export default createDrawerNavigator({
  Terms: HomeStack,
  About: AboutStack,
})

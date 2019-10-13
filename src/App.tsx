import React, { FunctionComponent, useEffect, useState } from 'react';
import { Animated, StatusBar, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Octicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import MainMenu from './screens/MainMenu';
import Level from './screens/Level';

console.disableYellowBox = true;

const AppNavigator = createStackNavigator({
  MainMenu: {
    screen: MainMenu,
  },
  Level: {
    screen: Level
  }
}, {
  initialRouteName: 'MainMenu',
  defaultNavigationOptions: {
    header: null
  }
});
const AppContainer = createAppContainer(AppNavigator);

const App: FunctionComponent = () => (
  <AppContainer />
);

export default App;

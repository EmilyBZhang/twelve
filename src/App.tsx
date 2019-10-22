import React, { FunctionComponent } from 'react';
import { AsyncStorage, StatusBar } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import MainMenu from './screens/MainMenu';
import Level from './screens/Level';
import colors from 'assets/colors';

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
      header: null,
      gesturesEnabled: false
    },
    cardStyle: {
      backgroundColor: colors.background
    }
});
const AppContainer = createAppContainer(AppNavigator);

const App: FunctionComponent = () => (<>
  <StatusBar hidden />
  <AppContainer />
</>);

export default App;

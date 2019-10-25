import React, { FunctionComponent } from 'react';
import { StatusBar } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider } from 'react-redux';

import store from 'reducers/store';
import MainMenu from 'screens/MainMenu';
import Level from 'screens/Level';
import Credits from 'screens/Credits';
import colors from 'assets/colors';
import InitSettings from 'components/InitSettings';

console.disableYellowBox = true;

const AppNavigator = createStackNavigator({
    MainMenu: {
      screen: MainMenu,
    },
    Level: {
      screen: Level
    },
    Credits: {
      screen: Credits
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

const App: FunctionComponent = () => (
  <Provider store={store}>
    <InitSettings />
    <StatusBar hidden />
    <AppContainer />
  </Provider>
);

export default App;

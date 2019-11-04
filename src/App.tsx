import React, { FunctionComponent, useState } from 'react';
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
import InitFonts from 'components/InitFonts';
import ScreenContainer from 'components/ScreenContainer';

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

const App: FunctionComponent = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  return (
    <Provider store={store}>
      <InitSettings />
      <InitFonts onLoad={() => setFontsLoaded(true)} />
      <StatusBar hidden />
      {fontsLoaded ? (
        <AppContainer />
      ) : <ScreenContainer />}
    </Provider>
  );
};

export default App;

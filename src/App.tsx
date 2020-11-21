import React, { FunctionComponent, useState, useCallback } from 'react';
import { StatusBar } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider } from 'react-redux';

import store from 'reducers/store';
import MainMenu from 'screens/MainMenu';
import Level from 'screens/Level';
import Credits from 'screens/Credits';
import colors from 'res/colors';
import InitSettings from 'components/InitSettings';
import InitFonts from 'components/InitFonts';
import TitleScreen from 'components/TitleScreen';
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

// TODO: Consider keeping the twelve logo while the fonts are loading, or change the splash image to be blank
const App: FunctionComponent = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const initFonts = useCallback(() => setFontsLoaded(true), []);

  return (
    <Provider store={store}>
      <InitSettings />
      <InitFonts onLoad={initFonts} />
      <StatusBar hidden />
      {fontsLoaded ? (
        <AppContainer />
      ) : <ScreenContainer />}
    </Provider>
  );
};

export default App;

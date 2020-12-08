import React, { FunctionComponent, useState, useCallback } from 'react';
import { LogBox, StatusBar } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider } from 'react-redux';

import store from 'reducers/store';
import useSettings from 'hooks/useSettings';
import MainMenu from 'screens/MainMenu';
import Level from 'screens/Level';
import Credits from 'screens/Credits';
import FakeAd from 'screens/FakeAd';
import colors from 'res/colors';
import InitSettings from 'components/init/InitSettings';
import InitFonts from 'components/init/InitFonts';
import InitAdMob from 'components/init/InitAdMob';
import TitleScreen from 'components/TitleScreen';
import ScreenContainer from 'components/ScreenContainer';
import MeasureScreen from 'components/init/MeasureScreen';

LogBox.ignoreAllLogs(true);

const AppNavigator = createStackNavigator({
    MainMenu: {
      screen: MainMenu,
    },
    Level: {
      screen: Level,
    },
    Credits: {
      screen: Credits,
    },
    FakeAd: {
      screen: FakeAd,
    },
  }, {
    initialRouteName: 'MainMenu',
    defaultNavigationOptions: {
      headerShown: false,
      gestureEnabled: false,
      cardStyle: {
        backgroundColor: colors.background,
      },
    },
});
const AppContainer = createAppContainer(AppNavigator);

// TODO: Consider keeping the twelve logo while the fonts are loading, or change the splash image to be blank
const App: FunctionComponent = () => {
  const [settingsReady, setSettingsReady] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [adMobReady, setAdMobReady] = useState(false);

  const initSettings = useCallback(() => setSettingsReady(true), []);
  const initFonts = useCallback(() => setFontsReady(true), []);
  const initAdMod = useCallback(() => setAdMobReady(true), []);

  const ready = settingsReady && fontsReady && adMobReady;

  return (
    <Provider store={store}>
      <InitSettings onLoad={initSettings} />
      <InitFonts onLoad={initFonts} />
      <InitAdMob onLoad={initAdMod} />
      {/* <MeasureScreen onLoad={} /> */}
      <StatusBar hidden />
      {ready ? <AppContainer /> : <ScreenContainer />}
    </Provider>
  );
};

export default App;

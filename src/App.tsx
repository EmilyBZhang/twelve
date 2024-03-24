import React, {
  FunctionComponent,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { LogBox, StatusBar, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import store from 'reducers/store';
import MainMenu from 'screens/MainMenu';
import Level from 'screens/Level';
import Credits from 'screens/Credits';
import FakeAd from 'screens/FakeAd';
import colors from 'res/colors';

// TODO: Change these to be a hook instead of dummy components
import InitSettings from 'components/init/InitSettings';
import InitFonts from 'components/init/InitFonts';
// import InitAdMob from 'components/init/InitAdMob';
import InitImages from 'components/init/InitImages';
import InitAudio from 'components/init/InitAudio';
import InitAndroid from 'components/init/InitAndroid';

LogBox.ignoreAllLogs(true);

const Stack = createNativeStackNavigator();

// TODO: useSafeAreaInsets() to make dimensions correct for iOS: https://docs.expo.dev/versions/latest/sdk/safe-area-context/
// TODO: Consider keeping the twelve logo while the fonts are loading, or change the splash image to be blank
const App: FunctionComponent = () => {
  const [settingsReady, setSettingsReady] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  // const [adMobReady, setAdMobReady] = useState(true);
  const [imagesReady, setImagesReady] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [androidReady, setAndroidReady] = useState(false);

  const initSettings = useCallback(() => setSettingsReady(true), []);
  const initFonts = useCallback(() => setFontsReady(true), []);
  // const initAdMod = useCallback(() => setAdMobReady(true), []);
  const initImages = useCallback(() => setImagesReady(true), []);
  const initAudio = useCallback(() => setAudioReady(true), []);
  const initAndroid = useCallback(() => setAndroidReady(true), []);

  const isLoaded = [
    settingsReady,
    fontsReady,
    // adMobReady,
    imagesReady,
    audioReady,
    androidReady,
  ].every((x) => x);

  useEffect(() => {
    if (isLoaded) SplashScreen.hideAsync();
  }, [isLoaded]);

  return (
    <Provider store={store}>
      <InitSettings onLoad={initSettings} />
      <InitFonts onLoad={initFonts} />
      <InitImages onLoad={initImages} />
      <InitAudio onLoad={initAudio} />
      <InitAndroid onLoad={initAndroid} />
      <StatusBar hidden />
      {isLoaded && (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="MainMenu"
              screenOptions={{
                headerShown: false,
                gestureEnabled: false,
                contentStyle: {
                  backgroundColor: colors.background,
                },
                animation: 'fade',
                animationDuration: 1000 / 24,
              }}
            >
              <Stack.Screen name="MainMenu" component={MainMenu} />
              <Stack.Screen name="Level" component={Level} />
              <Stack.Screen name="Credits" component={Credits} />
              <Stack.Screen name="FakeAd" component={FakeAd} />
            </Stack.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
      )}
    </Provider>
  );
};

export default App;

import { Dimensions } from 'react-native';
import { StyleSheetManager } from 'styled-components';
import Constants from 'expo-constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

const styles = {
  coinSize: Math.floor(screenWidth / 9),
  levelTextSize: Math.floor(screenWidth * 4 / 45),
  levelNavHeight: Math.floor(screenWidth / 9),
  levelTopMargin: Math.floor(screenWidth / 9) + Constants.statusBarHeight,
  levelNavZIndex: 1728,
};

export default styles;

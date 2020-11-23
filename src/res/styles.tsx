import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

const styles = {
  coinSize: Math.floor(screenWidth / 9),
  levelTextSize: Math.floor(screenWidth * 4 / 45),
  levelNavHeight: Math.floor(screenWidth / 9),
  levelNavZIndex: 1728,
};

export default styles;

import { Dimensions } from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const styles = {
  coinSize: Math.floor(windowWidth / 9),
  levelTextSize: Math.floor(windowWidth * 4 / 45),
  levelNavHeight: Math.floor(windowWidth / 9),
  levelNavZIndex: 1728,
};

export default styles;

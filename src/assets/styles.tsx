import { Dimensions } from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('screen');

const styles = {
  coinSize: windowWidth / 9,
  levelTextSize: windowWidth * 4 / 45,
  levelNavHeight: 40,
  levelNavZIndex: 1728
};

export default styles;

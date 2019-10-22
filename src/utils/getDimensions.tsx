import { Dimensions } from 'react-native';

import styles from 'assets/styles';

export const getDimensions = (level = false) => {
  const { width, height: windowHeight } = Dimensions.get('window');
  const height = windowHeight - (level ? styles.levelNavHeight : 0);
  return { width, height };
};

export const getFullDimensions = () => {
  return Dimensions.get('window');
};

export const getLevelDimensions = () => {
  return getDimensions(true);
};

export default getDimensions;

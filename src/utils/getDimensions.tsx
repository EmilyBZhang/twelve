import { Dimensions } from 'react-native';

import styles from 'assets/styles';

/**
 * Get the dimensions of the screen
 * 
 * @param level Whether the dimensions should be for a level or not
 */
export const getDimensions = (level = false) => {
  const { width, height: windowHeight } = Dimensions.get('window');
  const height = windowHeight - (level ? styles.levelNavHeight : 0);
  return { width, height };
};

/**
 * Get the dimensions of the screen
 */
export const getFullDimensions = () => {
  return Dimensions.get('window');
};

/**
 * Get the dimensions of a level
 */
export const getLevelDimensions = () => {
  return getDimensions(true);
};

export default getDimensions;

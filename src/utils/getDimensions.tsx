import { Dimensions, StatusBar } from 'react-native';

import styles from 'res/styles';

// TODO: Test if these dimensions are correct for SafeAreaView (e.g. iPhone X)

/**
 * Get the dimensions of the screen
 * 
 * @param level Whether the dimensions should be for a level or not
 */
export const getDimensions = (level = false) => {
  const { width, height: windowHeight } = Dimensions.get('screen');
  const height = windowHeight - (level ? styles.levelNavHeight : 0) - (StatusBar.currentHeight || 0);
  return { width, height };
};

/**
 * Get the dimensions of the screen
 */
export const getFullDimensions = () => {
  return Dimensions.get('screen');
};

/**
 * Get the dimensions of a level
 */
export const getLevelDimensions = () => {
  return getDimensions(true);
};

export default getDimensions;

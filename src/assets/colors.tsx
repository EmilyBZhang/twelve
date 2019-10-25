export type CoinColor = 'blue' | 'yellow' | 'green' | 'red';

/**
 * Color constants for the project
 */
const colors = {
  foreground: 'indigo',
  background: 'cyan',
  foregroundPressed: '#260041',
  coin: 'blue' as CoinColor,
  orderedCoin: 'yellow' as CoinColor,
  selectCoin: 'green' as CoinColor,
  badCoin: 'red' as CoinColor,
  coinUnderlay: 'darkblue',
  orderedCoinUnderlay: '#c0c000',
  selectCoinUnderlay: 'darkgreen',
  badCoinUnderlay: 'darkred',
};

export default colors;

/**
 * underlayColor prop for TouchableHighlight with a given CoinColor
 */
export const coinUnderlayColors = {
  [colors.coin]: colors.coinUnderlay,
  [colors.orderedCoin]: colors.orderedCoinUnderlay,
  [colors.selectCoin]: colors.selectCoinUnderlay,
  [colors.badCoin]: colors.badCoinUnderlay,
};

/**
 * MaterialCommunityIcons name associated with each color
 */
export const colorIcons = {
  [colors.coin]: 'plus', // Maybe cash, checkmark, star, or target/bullseye
  [colors.orderedCoin]: 'delta', // Maybe nut
  [colors.selectCoin]: 'asterisk',
  [colors.badCoin]: 'alert-octagon',
};

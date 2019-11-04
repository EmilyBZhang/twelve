// TODO: Consider adding transparent to CoinColor
export type CoinColor = 'blue' | 'yellow' | 'green' | 'red' | 'white' | 'black';

/**
 * Color constants for the project
 */
const colors = {
  foreground: 'indigo',
  background: '#00ffff', // cyan
  foregroundPressed: '#260041',
  coin: 'blue' as CoinColor,
  orderedCoin: 'yellow' as CoinColor,
  selectCoin: 'green' as CoinColor,
  badCoin: 'red' as CoinColor,
  onCoin: 'white' as CoinColor,
  offCoin: 'black' as CoinColor,
  coinUnderlay: 'darkblue',
  orderedCoinUnderlay: '#c0c000',
  selectCoinUnderlay: 'darkgreen',
  badCoinUnderlay: 'darkred',
  onCoinUnderlay: 'lightgray',
  // TODO: Make offCoin consistent with other coins in that it goes from light to dark
  offCoinUnderlay: 'darkgray'
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
  [colors.onCoin]: colors.onCoinUnderlay,
  [colors.offCoin]: colors.offCoinUnderlay
};

/**
 * MaterialCommunityIcons name associated with each color
 */
export const colorIcons = {
  [colors.coin]: 'plus',
  [colors.orderedCoin]: 'nut',
  [colors.selectCoin]: 'asterisk',
  [colors.badCoin]: 'alert-octagon',
  [colors.onCoin]: 'power-on',
  [colors.offCoin]: 'power-off'
};

/**
 * Set of CoinColor colors which are dark
 */
export const darkCoinColors = new Set([
  colors.coin,
  colors.selectCoin,
  colors.offCoin
]);

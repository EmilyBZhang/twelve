// TODO: Consider adding transparent to CoinColor
// TODO: Update CoinColor using new values
export type CoinColor = 'blue' | '#fbbc05' | 'green' | 'red' | 'white' | 'black';

/**
 * Color constants for the project
 * 
 * Consider this color pallet: https://coolors.co/ffffff-00171f-003459-007ea7-00a8e8
 */
const colors = {
  // foreground: '#003459',
  // background: '#00a8e8',
  // orderedCoin: '#fbbc05' as CoinColor,

  // Other pastels:
  // Blue: #77dbfd
  // Red: #ffb7b8
  // Green: #c3e4b9
  // Yellow: #f5f59d

  foreground: '#4b0082',
  // background: '#b4807d',
  background: '#f0c8f0',
  foregroundPressed: '#260041',

  darkWood: '#8b4513',
  lightWood: '#deb887',

  coin: '#1e90ff' as CoinColor,
  orderedCoin: '#e6c436' as CoinColor,
  selectCoin: '#61b75d' as CoinColor,
  badCoin: '#ff3d3d' as CoinColor,

  lightText: '#ffffff',
  darkText: '#000000',

  plainSurface: '#bfbfbf',
  grass: '#61b75d',


  // foreground: '#4b0082', // indigo
  // background: '#00ffff',// cyan
  // foregroundPressed: '#260041',
  // coin: '#0000ff' as CoinColor,
  // orderedCoin: '#ffff00' as CoinColor,
  // selectCoin: '#008000' as CoinColor,
  // badCoin: '#ff0000' as CoinColor,
  onCoin: '#ffffff' as CoinColor,
  offCoin: '#282828' as CoinColor,
  // TODO: Convert all colors to hex
  coinUnderlay: 'darkblue',
  orderedCoinUnderlay: '#bfbf00',
  selectCoinUnderlay: 'darkgreen',
  badCoinUnderlay: 'darkred',
  onCoinUnderlay: 'lightgray',
  offCoinUnderlay: '#000000',


  disabledCoinOpacity: 0.5,
};

// #5D608E

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
  [colors.orderedCoin]: 'axis',
  [colors.selectCoin]: 'asterisk',
  [colors.badCoin]: 'stop',
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

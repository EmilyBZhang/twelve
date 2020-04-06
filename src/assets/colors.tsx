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
  foreground: 'indigo',
  background: '#00ffff',// cyan
  foregroundPressed: '#260041',
  coin: '#0000ff' as CoinColor,
  orderedCoin: '#ffff00' as CoinColor,
  selectCoin: '#008000' as CoinColor,
  badCoin: '#ff0000' as CoinColor,
  onCoin: '#ffffff' as CoinColor,
  offCoin: '#000000' as CoinColor,
  coinUnderlay: 'darkblue',
  orderedCoinUnderlay: '#c0c000',
  selectCoinUnderlay: 'darkgreen',
  badCoinUnderlay: 'darkred',
  onCoinUnderlay: 'lightgray',
  // TODO: Make offCoin consistent with other coins in that it goes from light to dark
  offCoinUnderlay: 'darkgray',
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

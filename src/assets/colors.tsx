export type CoinColor = 'blue' | 'yellow' | 'green' | 'red';

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

export const coinUnderlayColors = {
  [colors.coin]: colors.coinUnderlay,
  [colors.orderedCoin]: colors.orderedCoinUnderlay,
  [colors.selectCoin]: colors.selectCoinUnderlay,
  [colors.badCoin]: colors.badCoinUnderlay,
};

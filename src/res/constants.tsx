import { Platform } from 'react-native'
import Constants from 'expo-constants';
import { AdMobRewarded } from 'expo-ads-admob';

export const NUM_LEVELS = 72;

export const AD_UNIT_ID_TEST = Platform.select({
  ios: 'ca-app-pub-3940256099942544/1712485313',
  android: 'ca-app-pub-3940256099942544/5224354917',
  default: 'ca-app-pub-3940256099942544/5224354917',
});
export const AD_UNIT_ID_PROD = Platform.select({
  ios: 'ca-app-pub-5600114350279556/6182482355',
  android: 'ca-app-pub-5600114350279556/4329155269',
  default: 'ca-app-pub-5600114350279556/4329155269',
});
export const AD_UNIT_ID = (Constants.isDevice || __DEV__) ? AD_UNIT_ID_PROD : AD_UNIT_ID_TEST;

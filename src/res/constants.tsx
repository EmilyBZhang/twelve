import { Platform } from 'react-native'
import Constants from 'expo-constants';
import * as Device from 'expo-device';

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
export const PERSONALIZED_ADS = true;

const notchRegex = /^iPhone(?!10,1|10,2|10,4|10,5|12,8)(\d{2,},\d+)$/;
// TODO: Find more legitimate way to detect notch
export const HAS_NOTCH = Platform.select({
  ios: (typeof Device.modelId === 'string') && !!Device.modelId.match(notchRegex),
  android: false,
  default: false,
});

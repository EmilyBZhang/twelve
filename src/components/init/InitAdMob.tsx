import { FunctionComponent, memo, useEffect } from 'react';
import { AdMobRewarded } from 'expo-ads-admob';
import { AD_UNIT_ID } from 'res/constants';

interface InitAdMobProps {
  onLoad: () => any;
}

const InitAdMob: FunctionComponent<InitAdMobProps> = (props) => {
  useEffect(() => {
    AdMobRewarded.setAdUnitID(AD_UNIT_ID)
      .then(() => props.onLoad())
      .catch(console.warn);
  }, []);

  return null;
};

export default memo(InitAdMob);

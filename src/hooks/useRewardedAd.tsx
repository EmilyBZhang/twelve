import { useEffect, useCallback } from 'react';
// TODO: DEPRECATED
import { AdMobRewarded } from 'expo-ads-admob';
import { PERSONALIZED_ADS } from 'res/constants';

export type EventNameType = 'rewardedVideoUserDidEarnReward'
  | 'rewardedVideoDidLoad'
  | 'rewardedVideoDidFailToLoad'
  | 'rewardedVideoDidPresent'
  | 'rewardedVideoDidFailToPresent'
  | 'rewardedVideoDidDismiss';

export type EventMap = { [eventName in EventNameType]?: (...args: any[]) => any; };

const useRewardedAd = (callbacks: EventMap) => {
  useEffect(() => {
    Object.keys(callbacks).map((eventName) => {
      AdMobRewarded.addEventListener(
        eventName as EventNameType,
        callbacks[eventName as EventNameType]!
      );
    });
    return () => {
      Object.keys(callbacks).map((eventName) => {
        AdMobRewarded.removeEventListener(
          eventName as EventNameType,
          callbacks[eventName as EventNameType]!
        );
      });
    };
  }, [callbacks]);

  const requestAd = useCallback(async () => {
    // TODO: Check for in-app purchase
    try {
      await AdMobRewarded.requestAdAsync({ servePersonalizedAds: PERSONALIZED_ADS });
    } finally {
      await AdMobRewarded.showAdAsync();
    }
  }, []);

  return requestAd;
};

export default useRewardedAd;

import { useEffect, useCallback } from 'react';
import { AdMobRewarded } from 'expo-ads-admob';

type EventNameType = 'rewardedVideoDidRewardUser'
  | 'rewardedVideoDidLoad'
  | 'rewardedVideoDidFailToLoad'
  | 'rewardedVideoDidOpen'
  | 'rewardedVideoDidStart'
  | 'rewardedVideoDidClose'
  | 'rewardedVideoWillLeaveApplication';

type EventMap = { [eventName in EventNameType]?: () => any; };

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
    await AdMobRewarded.requestAdAsync({ servePersonalizedAds: true });
    await AdMobRewarded.showAdAsync();
  }, []);

  return requestAd;
};

export default useRewardedAd;

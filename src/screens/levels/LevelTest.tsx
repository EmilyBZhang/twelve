import React, { useEffect, useMemo } from 'react';
import { Alert, Button, View } from 'react-native';
import { AdMobRewarded } from 'expo-ads-admob';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'res/styles';
import colors from 'res/colors';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import useRewardedAd, { EventMap } from 'hooks/useRewardedAd';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const LevelTest: Level = (props) => {

  const callbacks = useMemo<EventMap>(() => ({
    rewardedVideoDidRewardUser: () => {
      console.log(new Date(), 'Ad finished');
      props.setCoinsFound(new Set([0,1,2,3,4,5,6,7,8,9,10,11]));
    },
    rewardedVideoDidFailToLoad: () => {
      Alert.alert('Could not load hint :(', 'Check your internet connection.');
    },
  }), []);

  const requestAd = useRewardedAd(callbacks);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <LevelText hidden={twelve}>twelve</LevelText>
      {coinPositions.map((coinPosition, index) => (
        <View
          key={String(index)}
          style={{position: 'absolute', ...coinPosition}}
        >
          <Coin
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
          />
        </View>
      ))}
      <Button title={'Show ad'} onPress={requestAd} />
    </LevelContainer>
  );
};

export default LevelTest;

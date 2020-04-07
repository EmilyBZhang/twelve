import React, { useEffect } from 'react';
import { View } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { calcPositions } from 'utils/coinPositions';
// import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelCounter from 'components/LevelCounter';
import getDimensions from 'utils/getDimensions';
import styles from 'assets/styles';

const { width: windowWidth, height: windowHeight } = getDimensions();
const landscapeWidth = windowHeight;
const landscapeHeight = windowWidth - styles.levelNavHeight;

const coinPositions = calcPositions(4, 3, {
  containerWidth: landscapeWidth,
  containerHeight: landscapeHeight,
});

const LevelContainer = styled.View`
  width: 100%;
  height: 100%;
  padding-top: ${styles.levelNavHeight}px;
`;

const Map = styled.Image.attrs({
  source: require('assets/images/world-map.jpg'),
  resizeMode: 'cover',
})`
  width: ${landscapeWidth}px;
  height: ${landscapeHeight}px;
`;

const LevelLandscape: Level = (props) => {

  useEffect(() => {
    // TODO: Fix race condition for level restart
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.ALL
    );
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, []);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <Map />
      {coinPositions.map((coinPosition, index: number) => (
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
    </LevelContainer>
  );
};

export default LevelLandscape;

import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { calcPositions } from 'utils/coinPositions';
import colors from 'res/colors';
import Coin from 'components/Coin';
import LevelCounter from 'components/LevelCounter';
import getDimensions from 'utils/getDimensions';
import styles from 'res/styles';

const { width: windowWidth, height: windowHeight } = getDimensions();
const landscapeWidth = windowHeight;
const landscapeHeight = windowWidth - styles.levelNavHeight;

const coinPositions = calcPositions(4, 3, {
  containerWidth: landscapeWidth * 1.5,
  containerHeight: landscapeHeight,
  xOffset: -landscapeWidth / 4
});

const LevelContainer = styled.View`
  width: 100%;
  height: 100%;
  padding-top: ${styles.levelNavHeight}px;
  background-color: ${colors.background};
`;

const Map = styled.Image.attrs({
  source: require('assets/images/12-transparent-4-3.png'),
  resizeMode: 'contain',
  fadeDuration: 0,
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
  const twelve = numCoinsFound >= 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <ScrollView horizontal>
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
      </ScrollView>
    </LevelContainer>
  );
};

export default LevelLandscape;

import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import LevelContainer from 'components/LevelContainer';
import LevelCounter from 'components/LevelCounter';
import FallingCoins from 'components/FallingCoins';
import CreditsFlatList from 'components/CreditsFlatList';
import LevelText from 'components/LevelText';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const ScreenContainer = styled.View.attrs({
  pointerEvents: 'box-none',
})`
  position: absolute;
  /* top: ${levelHeight / 6}px; */
  top: 0px;
  left: 0px;
  width: ${levelWidth}px;
  height: ${levelHeight}px;
  z-index: 1;
  display: flex;
  z-index: 0;
  justify-content: flex-end;
  align-items: center;
`;

const LevelCredits: Level = (props) => {
  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  return (
    <>
      <ScreenContainer>
        {/* <LevelText></LevelText> */}
        {/* // TODO: implement last screen of playlist */}
        <Image
          source={require('assets/images/twelve-splash.png')}
          resizeMode={'contain'}
          style={{
            width: levelWidth,
          }}
        />
        <Image
          source={require('assets/images/AppStore.png')}
          resizeMode={'contain'}
          style={{
            width: levelWidth * 5 / 6,
          }}
        />
      </ScreenContainer>
      <FallingCoins active onCoinPress={props.onCoinPress} coinsFound={props.coinsFound} />
    </>
  );
};

export default LevelCredits;

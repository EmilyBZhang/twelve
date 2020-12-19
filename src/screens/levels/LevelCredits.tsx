import React from 'react';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import LevelContainer from 'components/LevelContainer';
import LevelCounter from 'components/LevelCounter';
import FallingCoins from 'components/FallingCoins';
import CreditsFlatList from 'components/CreditsFlatList';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const ScreenContainer = styled.View.attrs({
  pointerEvents: 'box-none',
})`
  position: absolute;
  top: 0px;
  left: 0px;
  width: ${levelWidth}px;
  height: ${levelHeight}px;
  z-index: 1;
`;

const LevelCredits: Level = (props) => {
  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  return (
    <>
      <LevelContainer>
        <CreditsFlatList />
        <LevelCounter count={numCoinsFound} />
      </LevelContainer>
      {!twelve && (
        <ScreenContainer>
          <FallingCoins active onCoinPress={props.onCoinPress} coinsFound={props.coinsFound} />
        </ScreenContainer>
      )}
    </>
  );
};

export default LevelCredits;

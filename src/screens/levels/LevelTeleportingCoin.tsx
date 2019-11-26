import React, { useState } from 'react';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { randInt } from 'utils/random';
import styles from 'assets/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import { getLevelDimensions } from 'utils/getDimensions';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

interface CoinContainerProps {
  x: number;
  y: number;
}

const CoinContainer = styled.View<CoinContainerProps>`
  position: absolute;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
`;

const getRandomCoinPosition = () => {
  const x = randInt(levelWidth - styles.coinSize);
  const y = randInt(levelHeight - styles.coinSize);
  return {x, y};
};

const LevelTeleportingCoin: Level = (props) => {
  const [coinPosition, setCoinPosition] = useState(getRandomCoinPosition);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const handleCoinPress = () => {
    props.onCoinPress(numCoinsFound);
    setCoinPosition(getRandomCoinPosition);
  }

  return (
    <LevelContainer>
      <LevelText
        fontSize={24}
        hidden={twelve}
      >
        Where'd you come from?{'\n'}
        Where'd you go?
      </LevelText>
      <LevelCounter count={numCoinsFound} />
      <CoinContainer {...coinPosition}>
        <Coin
          onPress={handleCoinPress}
          found={twelve}
        />
      </CoinContainer>
    </LevelContainer>
  );
};

export default LevelTeleportingCoin;

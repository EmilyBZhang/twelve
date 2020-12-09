import React, { useState } from 'react';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { randCoinPoint } from 'utils/random';
import styles from 'res/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import ScavengerText from 'components/ScavengerText';

interface CoinContainerProps {
  x: number;
  y: number;
}

const CoinContainer = styled.View<CoinContainerProps>`
  position: absolute;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
`;

const LevelTeleportingCoin: Level = (props) => {
  const [coinPosition, setCoinPosition] = useState(() => randCoinPoint());

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const handleCoinPress = () => {
    props.onCoinPress(numCoinsFound);
    setCoinPosition(() => randCoinPoint());
  };

  return (
    <LevelContainer>
      <LevelText
        fontSize={styles.levelTextSize * 0.75}
        hidden={twelve}
      >
        Where'd you come from?{'\n'}
        Where'd <ScavengerText>y</ScavengerText>ou go?
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

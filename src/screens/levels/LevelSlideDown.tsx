import React from 'react';
import { Button, View } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import coinPositions from 'utils/coinPositions';
import styles from 'assets/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const deltaY = levelHeight / 5 / 3;

const coinSize = styles.coinSize;

interface CoinContainerProps {
  shifted: number;
}

const CoinContainer = styled.View<CoinContainerProps>`
  width: 100%;
  height: 100%;
  transform: translateY(${props => (props.shifted % 12 === 0) ? (
    0
  ) : (
    props.shifted * deltaY + coinSize / 2
  )}px);
  justify-content: center;
  align-items: center;
`;

const LevelSlideDown: Level = (props) => {

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const handleCoinPress = (index: number) => {
    const numRowsRemaining = 4 - Math.floor((numCoinsFound + 1) / 3);
    let movesAvailable = numRowsRemaining === 0;
    for (let i = 0; i < 3 * numRowsRemaining; i++) {
      if (i !== index && !props.coinsFound.has(i)) {
        movesAvailable = true;
        break;
      }
    }
    if (movesAvailable) props.onCoinPress(index);
    else props.setCoinsFound(new Set());
  };

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <CoinContainer shifted={numCoinsFound}>
        <LevelText hidden={twelve}>The sky is falling!</LevelText>
        {coinPositions.map((coinPosition, index) => (
          <View
            key={String(index)}
            style={{position: 'absolute', ...coinPosition}}
          >
            <Coin
              found={props.coinsFound.has(index)}
              onPress={() => handleCoinPress(index)}
              />
          </View>
        ))}
      </CoinContainer>
    </LevelContainer>
  );
};

export default LevelSlideDown;

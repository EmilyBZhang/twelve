import React from 'react';
import { Animated, View } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import coinPositions from 'utils/coinPositions';
import styles from 'res/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const deltaY = levelHeight / 5 / 3;

const coinSize = styles.coinSize;

interface BufferProps {
  shifted: number;
}

const Buffer = styled.View<BufferProps>`
  width: 100%;
  height: ${props => 2 * (props.shifted * deltaY + coinSize / 2)}px;
`;

const CoinContainer = styled.View`
  width: ${levelWidth}px;
  height: ${levelHeight}px;
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
      <Buffer shifted={numCoinsFound} />
      <CoinContainer>
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

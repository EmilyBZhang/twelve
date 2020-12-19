import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import ScavengerText from 'components/ScavengerText';

const FadeContainer = styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const LevelFadeOut: Level = (props) => {

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <FadeContainer style={{ opacity: Math.max(0, 1 - numCoinsFound / 6) }}>
        <LevelText hidden={twelve}><ScavengerText>t</ScavengerText>welve</LevelText>
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
      </FadeContainer>
    </LevelContainer>
  );
};

export default LevelFadeOut;

import React from 'react';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'res/styles';
import colors from 'res/colors';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const NiceTextContainer = styled.View`
  position: absolute;
  top: 0px;
  width: ${levelWidth * 3}px;
  height: ${levelWidth}px;
  justify-content: flex-end;
  align-items: center;
`;

const NiceText = styled.Text`
  color: ${colors.coin};
  font-family: montserrat-black;
  font-size: ${420/1080 * levelWidth}px;
  text-align: center;
`;

const position1 = {
  left: levelWidth * 477/1440 - styles.coinSize / 2,
  top: levelWidth * 884/1440 - styles.coinSize / 2,
};

const position2 = {
  left: levelWidth * 1280/1440,
  top: levelWidth * 1220/1440 - styles.coinSize / 2,
};

const CoinContainer = styled.View`
  position: absolute;
  width: ${styles.coinSize}px;
  height: ${styles.coinSize}px;
`;

const InvisibleText = styled.Text`
  color: transparent;
`;

const Level69: Level = (props) => (
  <LevelContainer>
    <LevelCounter count={props.coinsFound.size} />
    <NiceTextContainer><NiceText>nıce<InvisibleText>.</InvisibleText></NiceText></NiceTextContainer>
    <CoinContainer style={position1} />
    {Array.from(Array(6), (_, index) => !props.coinsFound.has(index) && (
      <CoinContainer key={String(index)} style={position1}>
        <Coin
          noShimmer
          colorHintOpacity={0}
          onPress={() => props.onCoinPress(index)}
        />
      </CoinContainer>
    ))}
    <CoinContainer style={position2} />
    {Array.from(Array(6), (_, index) => !props.coinsFound.has(6 + index) && (
      <CoinContainer key={String(index)} style={position2}>
        <Coin
          noShimmer
          colorHintOpacity={0}
          onPress={() => props.onCoinPress(6 + index)}
        />
      </CoinContainer>
    ))}
  </LevelContainer>
);

export default Level69;

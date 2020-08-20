import React from 'react';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import getDimensions from 'utils/getDimensions';
import styles from 'assets/styles';
import colors from 'assets/colors';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelCounter from 'components/LevelCounter';

const { width: windowWidth, height: windowHeight } = getDimensions();

const NiceTextContainer = styled.View`
  width: ${windowWidth * 3}px;
`;

const NiceText = styled.Text`
  color: ${colors.coin};
  font-family: montserrat-black;
  font-size: ${420/1080 * windowWidth}px;
  text-align: center;
`;

const position1 = {
  left: windowWidth * 477/1440 - styles.coinSize / 2,
  top: windowHeight * 1180/2368 - styles.levelNavHeight - styles.coinSize,
};

const position2 = {
  left: windowWidth * 1288/1440,
  top: windowHeight * 1508/2368 - styles.levelNavHeight - styles.coinSize,
};

const CoinContainer = styled.View`
  position: absolute;
  background-color: ${colors.background};
  width: ${styles.coinSize}px;
  height: ${styles.coinSize}px;
`;

const Level69: Level = (props) => (
  <LevelContainer>
    <LevelCounter count={props.coinsFound.size} />
    <NiceTextContainer><NiceText>nice.</NiceText></NiceTextContainer>
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

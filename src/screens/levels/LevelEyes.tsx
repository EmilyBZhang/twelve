import React, { FunctionComponent, useMemo } from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { calcPositions } from 'utils/coinPositions';
import colors from 'assets/colors';
import styles from 'assets/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import { shuffleArray } from 'utils/random';

const eyeSize = styles.coinSize;
const coinSize = eyeSize * 1.5;

const xRatio = 33 / 40;
const yRatio = 7 / 12;
const xRadius = eyeSize * xRatio / 2;
const yRadius = eyeSize * yRatio / 2;
const maxTheta = Math.PI / 2 - 2 * Math.atan((xRatio / yRatio - 1) / (xRatio / yRatio + 1));
const radius = xRatio / Math.sin(maxTheta) * eyeSize / 2;
const eyelashWidth = eyeSize / 10;
const eyelashHeight = eyeSize / 4;

const EyeContainer = styled.View`
  width: ${eyeSize}px;
  height: ${eyeSize}px;
  justify-content: center;
  align-items: center;
`;

const BaseEye = styled(MaterialCommunityIcons).attrs({
  name: 'eye-outline',
  size: eyeSize,
  color: 'black',
})`position: absolute;`;

const EyelashShape = styled.View`
  width: ${eyelashWidth}px;
  height: ${eyelashHeight}px;
  position: absolute;
  background-color: black;
`;

interface EyelashProps {
  rotate: number;
  flipped?: boolean;
}

const Eyelash: FunctionComponent<EyelashProps> = (props) => {
  const { rotate, flipped } = props;

  const radiusOffset = (radius - yRadius) * (flipped ? -1 : 1);
  const restoreOffset = (-radius - eyelashHeight / 2) * (flipped ? -1 : 1);
  return (
    <EyelashShape style={{
      transform: [
        {translateY: radiusOffset},
        {rotate: `${rotate}rad`},
        {translateY: restoreOffset}
      ]
    }} />
  );
};

interface EyeProps {
  index: number;
}

const Eye: FunctionComponent<EyeProps> = (props) => {
  const { index } = props;

  const upperNum = (index < 4) ? (index + 1) : Math.max(0, index - 7);
  const lowerNum = (index < 4) ? 0 : (index % 4 + 1);

  const upperDelta = maxTheta * 2 / (upperNum + 1);
  const lowerDelta = maxTheta * 2 / (lowerNum + 1);

  return (
    <EyeContainer>
      <BaseEye />
      {Array.from(Array(upperNum), (_, index) => (
        <Eyelash
          key={String(index)}
          rotate={-maxTheta + upperDelta * (index + 1)}
        />
      ))}
      {Array.from(Array(lowerNum), (_, index) => (
        <Eyelash
          key={String(index)}
          flipped
          rotate={-maxTheta + lowerDelta * (index + 1)}
        />
      ))}
    </EyeContainer>
  );
};

const LevelEyes: Level = (props) => {

  const coinPositions = useMemo(() => {
    const coinPositions = calcPositions(4, 3, {coinSize});
    shuffleArray(coinPositions);
    return coinPositions.map((position, index) => (
      [position, index] as [typeof position, number]
    ));
  }, []);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const handleCoinPress = (index: number) => {
    if (index === numCoinsFound) props.onCoinPress(index);
    else props.setCoinsFound(new Set());
  };

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <LevelText>↑↓↕</LevelText>
      {coinPositions.map(([coinPosition, index]) => (
        <View
          key={String(index)}
          style={{position: 'absolute', ...coinPosition}}
        >
          <Coin
            size={coinSize}
            color={colors.orderedCoin}
            found={props.coinsFound.has(index)}
            onPress={() => handleCoinPress(index)}
          >
            <Eye index={index} />
          </Coin>
        </View>
      ))}
    </LevelContainer>
  );
};

export default LevelEyes;

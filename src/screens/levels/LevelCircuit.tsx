import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Line, Polyline } from 'react-native-svg';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'res/styles';
import colors from 'res/colors';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const { coinSize } = styles;

const segmentLength = coinSize * 2.5;
const circuitMargin = coinSize;

const circuitWidth = levelWidth;
const circuitHeight = segmentLength * 3 + circuitMargin * 2;

const leftX = circuitMargin;
const rightX = circuitWidth - circuitMargin;
const baseY = circuitMargin;
const polylinePoints = [
  leftX + segmentLength + coinSize / 2,
  baseY + segmentLength * 3,
  leftX,
  baseY + segmentLength * 3,
  leftX,
  baseY + segmentLength * 2,
  leftX + segmentLength,
  baseY + segmentLength * 2,
  leftX + segmentLength,
  baseY + segmentLength,
  leftX,
  baseY + segmentLength,
  leftX,
  baseY,
  rightX,
  baseY,
  rightX,
  baseY + segmentLength,
  rightX - segmentLength,
  baseY + segmentLength,
  rightX - segmentLength,
  baseY + segmentLength * 2,
  rightX,
  baseY + segmentLength * 2,
  rightX,
  baseY + segmentLength * 3,
  rightX - segmentLength - coinSize / 2,
  baseY + segmentLength * 3,
];

const BatteryIcon = styled(MaterialCommunityIcons).attrs({
  name: 'car-battery',
  size: coinSize,
  color: colors.foreground,
})`
  background-color: ${colors.background};
  position: absolute;
  top: ${baseY - coinSize / 2}px;
`;

const CircuitContainer = styled(Svg).attrs({})`
  position: absolute;
  top: 0px;
  left: 0px;
  width: ${circuitWidth}px;
  height: ${circuitHeight}px;
`;

const LevelCircuit: Level = (props) => {

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <CircuitContainer>
        <Polyline
          points={polylinePoints}
          stroke={colors.offCoin}
          strokeWidth={styles.coinSize / 12}
        />
      </CircuitContainer>
      <BatteryIcon />
      {/* {coinPositions.map((coinPosition, index) => (
        <View
          key={String(index)}
          style={{position: 'absolute', ...coinPosition}}
        >
          <Coin
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
          />
        </View>
      ))} */}
    </LevelContainer>
  );
};

export default LevelCircuit;

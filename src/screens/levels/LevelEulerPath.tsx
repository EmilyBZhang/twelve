import React, { useRef } from 'react';
import { View } from 'react-native';
import Svg, { Line } from 'react-native-svg'
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

const containerSize = levelWidth;

const margin = levelWidth / 3;
const mid = levelWidth / 2;
const points = [
  [mid, mid - margin],
  [mid + margin, mid - margin],
  [mid - margin, mid],
  [mid, mid],
  [mid + margin, mid],
  [mid - margin, mid + margin],
  [mid, mid + margin],
] as Array<[number, number]>;
const edgeIndices = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 4],
  [2, 3],
  [2, 5],
  [3, 4],
  [3, 6],
  [4, 6],
  [5, 6],
] as Array<[number, number]>;
const adjMatrixInit = edgeIndices.reduce((accum, [i, j]) => {
  accum[i].add(j);
  accum[j].add(i);
  return accum;
}, points.map(() => new Set<number>()));

const SvgContainer = styled(Svg)`
  width: ${containerSize}px;
  height: ${containerSize}px;
`;

const measure = () => {
  const t0 = new Date();
  const newMatrix = adjMatrixInit.map(set => new Set(set));
  console.log(new Date().getTime() - t0.getTime(), 'ms');
  return newMatrix;
}

const LevelEulerPath: Level = (props) => {

  const prevIndex = useRef(-1);
  const adjMatrix = useRef(adjMatrixInit.map(set => new Set(set)));

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const handleCoinPress = (index: number) => {
    if (prevIndex.current === -1) {
      prevIndex.current = index;
      props.onCoinPress();
      return;
    }
    if (!adjMatrix.current[prevIndex.current].has(index)) {
      adjMatrix.current = adjMatrixInit.map(set => new Set(set));
      prevIndex.current = -1;
      props.setCoinsFound();
      return;
    }
    adjMatrix.current[prevIndex.current].delete(index);
    adjMatrix.current[index].delete(prevIndex.current);
    prevIndex.current = index;
    props.onCoinPress();
  };

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      {/* <LevelText hidden={twelve}>twelve</LevelText> */}
      <SvgContainer>
        {edgeIndices.map(([i, j], index) => adjMatrix.current[i].has(j) && (
          <Line
            key={String(index)}
            stroke={colors.offCoin}
            strokeWidth={styles.coinSize / 12}
            x1={points[i][0]}
            x2={points[j][0]}
            y1={points[i][1]}
            y2={points[j][1]}
          />
        ))}
      </SvgContainer>
      {points.map(([x, y], index) => (
        <View
          key={String(index)}
          style={{
            position: 'absolute',
            left: x - styles.coinSize / 2,
            top: y + (levelHeight - levelWidth - styles.coinSize) / 2,
          }}
        >
          <Coin
            color={(index === prevIndex.current) ? colors.badCoin : colors.selectCoin}
            found={adjMatrix.current[index].size === 0}
            onPress={() => handleCoinPress(index)}
          />
        </View>
      ))}
    </LevelContainer>
  );
};

export default LevelEulerPath;

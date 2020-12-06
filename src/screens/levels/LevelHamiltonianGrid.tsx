import React, { useRef } from 'react';
import { View } from 'react-native';
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
const numRows = 4;
const numCols = 4;
const missingIndices = new Set([0, 2, 3, 9]);

const Row = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;

const Grid = styled.View`
  width: ${levelWidth}px;
  height: ${levelWidth}px;
  flex-direction: column;
  justify-content: space-around;
`;

const LevelHamiltonianGrid: Level = (props) => {
  const prevIndex = useRef<number | null>(null);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const handleCoinPress = (index: number) => {
    if (prevIndex.current === null) {
      prevIndex.current = index;
      props.onCoinPress(index);
      return;
    }
    const row = Math.floor(index / numCols);
    const col = index % numCols;
    const prevRow = Math.floor(prevIndex.current / numCols);
    const prevCol = prevIndex.current % numCols;
    if ((Math.abs(row - prevRow) + Math.abs(col - prevCol)) === 1) {
      prevIndex.current = index;
      props.onCoinPress(index);
      return;
    }
    prevIndex.current = null;
    props.setCoinsFound();
  };

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <Grid>
        {Array.from(Array(numRows), (_, row) => (
          <Row key={String(row)}>
            {Array.from(Array(numCols), (_, col) => {
              const index = row * numCols + col;
              const found = missingIndices.has(index) || props.coinsFound.has(index);
              return (
                <Coin
                  key={String(index)}
                  color={colors.selectCoin}
                  hidden={found}
                  disabled={found}
                  onPress={() => handleCoinPress(index)}
                />
              );
            })}
          </Row>
        ))}
      </Grid>
    </LevelContainer>
  );
};

export default LevelHamiltonianGrid;

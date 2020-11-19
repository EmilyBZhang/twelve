// Word search, maybe 8x8 or 9x9
// Find twelve twice

import React, { useState, useRef } from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import styles from 'assets/styles';
import colors from 'assets/colors';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const numRows = 8;
const numCols = 8;
const puzzle = [
  'elvewtle',
  'tetltwel',
  'wwvwlewt',
  'etevevtw',
  'tewlwlve',
  'vlewtwvl',
  'evlewtwe',
  'levtwelv',
].map(row => row.split(''));

const ans = 'twelve';

interface LetterProps {
  active?: boolean;
}

const Letter = styled.Text<LetterProps>`
  font-family: montserrat-black;
  font-size: ${styles.coinSize}px;
  color: ${colors.foreground};
  text-align: center;
  border-radius: ${styles.coinSize / 2}px;
  ${props => props.active ? `background-color: ${colors.coin}80;` : ''}
`;

const RowContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const CellTouchable = styled.TouchableOpacity`
  flex: 1;
`;

interface Cell {
  row: number;
  col: number;
}

const getIndex = (row: number, col: number) => row * numCols + col;

const LevelWordSearch: Level = (props) => {

  const [anim1] = useState(new Animated.Value(0));
  const [anim2] = useState(new Animated.Value(0));
  const [prev, setPrev] = useState<Cell | null>(null);
  const direction = useRef<Cell | null>(null);
  const activeCells = useRef(new Set<number>());

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const revealActiveCells = () => {
  };

  const handleLetterPress = (row: number, col: number) => {
    const letter = puzzle[row][col];
    
    const resetWithT = () => {
      direction.current = null;
      activeCells.current.clear();
      if (letter === ans[0]) {
        activeCells.current.add(getIndex(row, col));
        setPrev({ row, col });
      } else {
        setPrev(null);
      }
    };

    // Check first letter
    if (!prev) {
      resetWithT();
      return;
    }

    const nextIndex = activeCells.current.size;
    const nextLetter = ans[nextIndex];

    // Check second letter
    if (!direction.current) {
      if (letter !== nextLetter) {
        resetWithT();
        return;
      }
      const dr = row - prev.row;
      const dc = col - prev.col;
      if (Math.abs(dr) <= 1 && Math.abs(dc) <= 1 && (dr | dc)) {
        direction.current = { row: dr, col: dc };
        activeCells.current.add(getIndex(row, col));
        setPrev({ row, col });
      } else {
        resetWithT();
      }
      return;
    }

    // Check other letters
    if (letter === nextLetter) {
      const isMatch = (
        (prev.row + direction.current.row === row) && (prev.col + direction.current.col === col)
      );
      if (isMatch) {
        if (nextIndex + 1 === ans.length) {
          // TODO: word is found
        }
        activeCells.current.add(getIndex(row, col));
        setPrev({ row, col });
        return;
      }
    }
    resetWithT();
  };

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      {puzzle.map((row, rowIndex) => (
        <RowContainer key={String(rowIndex)}>
          {row.map((letter, colIndex) => (
            <CellTouchable onPress={() => handleLetterPress(rowIndex, colIndex)}>
              <Letter
                key={String(colIndex)}
                active={activeCells.current.has(getIndex(rowIndex, colIndex))}
              >
                {letter}
              </Letter>
            </CellTouchable>
          ))}
        </RowContainer>
      ))}
    </LevelContainer>
  );
};

export default LevelWordSearch;

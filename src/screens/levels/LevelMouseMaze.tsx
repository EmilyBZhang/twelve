// TODO: Mouse fainting animation if fail, play sounds, add animations

import React, { useState } from 'react';
import { Button, FlatList } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import colors from 'assets/colors';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

type Direction = 'bottom' | 'left' | 'right' | 'top';

const MAZE_ROWS = 4;
const MAZE_COLS = 4;

const mazeBorderWidth = 1;
const mazeSizeNoBorder = levelWidth * 3 / 4;
const mazeSize = mazeSizeNoBorder + mazeBorderWidth * 2;
const mazeTileBorderWidth = 1;
const mazeTileSize = mazeSizeNoBorder / MAZE_COLS;
const mazeTileSizeNoBorder = mazeTileSize - mazeTileBorderWidth * 2;

const directions = {
  B: 'bottom',
  L: 'left',
  R: 'right',
  T: 'top'
} as {[initial: string]: Direction};

interface HasDirection {
  direction: Direction;
}

const rotations = {
  bottom: '0deg',
  left: '90deg',
  right: '-90deg',
  top: '180deg'
} as {[direction: string]: string};

const mazeStyle = {
  width: mazeSize,
  height: mazeSize,
  backgroundColor: '#c0c0c0',
  borderWidth: mazeBorderWidth,
  borderColor: 'black',
  padding: 0,
  margin: 0
};

const MazeRowContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const MazeContainer = styled.View`
  width: ${mazeSize}px;
  height: ${mazeSize}px;
`;

interface MouseProps {
  rotate: string;
}

const Mouse = styled.Image.attrs({
  source: require('assets/images/mouse.png'),
  resizeMode: 'contain'
})<MouseProps>`
  width: 100%;
  height: 100%;
  transform: rotate(${props => props.rotate});
`;

const Cheese = styled.Image.attrs({
  source: require('assets/images/cheese.png'),
  resizeMode: 'contain'
})`
  width: 100%;
  height: 100%;
`;

interface MazeTileProps {
  borders: Array<Direction>;
}

const MazeTile = styled.View<MazeTileProps>`
  flex: 1;
  border-width: ${mazeTileBorderWidth}px;
  width: ${mazeTileSize}px;
  height: ${mazeTileSize}px;
  border-top-color: transparent;
  border-bottom-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
  ${props => props.borders.map(
    direction => `border-${direction}-color: black;`
  ).join('\n')}
`;

const mazeBorderCodes = [
  'LT', 'T', 'T', 'RT',
  'LR', 'L', 'R', 'LR',
  'BL', 'R', 'L', 'BR',
  'BLT', 'B', 'B', 'BRT'
];

const mazeBorders = mazeBorderCodes.map((direction) => (
  Array.from(direction, dir => directions[dir])
));

const mouseStartIndex = 12;
const cheeseStartIndices = new Set([4, 7, 15]);

const LevelMouseMaze: Level = (props) => {
  const [mouseIndex, setMouseIndex] = useState(mouseStartIndex);
  const [cheeseIndices, setCheeseIndices] = useState(cheeseStartIndices);
  const [lastMove, setLastMove] = useState<Direction>('bottom');

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const handleCoinPress = (direction: Direction) => {
    const validMove = mazeBorders[mouseIndex].indexOf(direction) === -1;
    if (validMove) {
      let newMouseIndex = mouseIndex;
      switch (direction) {
        case 'top':
          newMouseIndex -= MAZE_COLS;
          break;
        case 'right':
          newMouseIndex++;
          break;
        case 'left':
          newMouseIndex--;
          break;
        default:
          newMouseIndex += MAZE_COLS;
      }
      const foundCheese = cheeseIndices.has(newMouseIndex);
      if (numCoinsFound + 1 === 12) {
        if (cheeseIndices.size > 1 || (cheeseIndices.size === 1 && !foundCheese)) {
          props.setCoinsFound(new Set<number>());
          setMouseIndex(mouseStartIndex);
          setCheeseIndices(cheeseStartIndices);
          setLastMove('bottom');
          return;
        }
      }
      props.onCoinPress(numCoinsFound);
      if (foundCheese) {
        const newCheeseIndices = new Set(cheeseIndices);
        newCheeseIndices.delete(newMouseIndex);
        setCheeseIndices(newCheeseIndices);
      }
      setMouseIndex(newMouseIndex);
    }
    setLastMove(direction);
  };

  const NavCoin = styled(Coin).attrs((props: HasDirection) => ({
    color: colors.orderedCoin,
    disabled: twelve,
    onPress: () => handleCoinPress(props.direction)
  }))<HasDirection>``;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <NavCoin direction={'top'} />
      <MazeRowContainer>
        <NavCoin direction={'left'} />
        <MazeContainer>
          <FlatList
            data={mazeBorders}
            extraData={[mouseIndex, cheeseIndices]}
            numColumns={MAZE_COLS}
            horizontal={false}
            keyExtractor={(_, index) => String(index)}
            contentContainerStyle={mazeStyle}
            renderItem={({ item: borders, index }) => {
              let children = null;
              if (index === mouseIndex) {
                children = <Mouse rotate={rotations[lastMove]} />
              } else if (cheeseIndices.has(index)) {
                children = <Cheese />
              }
              return (
                <MazeTile borders={borders}>
                  {children}
                </MazeTile>
              );
            }}
          />
        </MazeContainer>
        <NavCoin direction={'right'} />
      </MazeRowContainer>
      <NavCoin direction={'bottom'} />
    </LevelContainer>
  );
};

export default LevelMouseMaze;

// TODO: Mouse fainting animation if fail, play sounds, add animations

import React, { useState } from 'react';
import { Animated, Easing, FlatList } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import colors from 'res/colors';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import playAudio from 'utils/playAudio';
import styles from 'res/styles';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const mouseSound = require('assets/sfx/mouse.mp3');

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

enum Directions {
  bottom,
  left,
  top,
  right
}

const dirId = {
  bottom: 0,
  left: 1,
  top: 2,
  right: 3,
} as {[direction: string]: number};

const mazeStyle = {
  width: mazeSize,
  height: mazeSize,
  backgroundColor: colors.plainSurface,
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

const MouseContainer = styled(Animated.View)``;

const Mouse = styled(Animated.Image).attrs({
  source: require('assets/images/mouse.png'),
  resizeMode: 'contain',
  fadeDuration: 0,
})`
  width: 100%;
  height: 100%;
`;

const Cheese = styled.Image.attrs({
  source: require('assets/images/cheese.png'),
  resizeMode: 'contain',
  fadeDuration: 0,
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
const startDirection = Directions.top;

const indexToXY = (index: number) => {
  const r = Math.floor(index / MAZE_COLS);
  const c = index % MAZE_COLS;
  return ({
    x: c * mazeTileSize,
    y: r * mazeTileSize
  });
};

const startXY = indexToXY(mouseStartIndex);

const LevelMouseMaze: Level = (props) => {
  const [mouseIndex, setMouseIndex] = useState(mouseStartIndex);
  const [cheeseIndices, setCheeseIndices] = useState(cheeseStartIndices);
  const [rotateAnim] = useState(() => new Animated.Value(startDirection));
  const [moveAnim] = useState(() => new Animated.ValueXY(startXY));

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

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
          rotateAnim.setValue(startDirection);
          moveAnim.setValue(startXY);
          return;
        }
      }
      props.onCoinPress(numCoinsFound);
      if (foundCheese) {
        playAudio(mouseSound, undefined, { volume: 3/4 });
        const newCheeseIndices = new Set(cheeseIndices);
        newCheeseIndices.delete(newMouseIndex);
        setCheeseIndices(newCheeseIndices);
      }
      setMouseIndex(newMouseIndex);
      Animated.timing(moveAnim, {
        toValue: indexToXY(newMouseIndex),
        duration: 125,
        easing: Easing.linear,
        useNativeDriver: true
      }).start();
    }
    Animated.timing(rotateAnim, {
      toValue: dirId[direction],
      duration: 125,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  };

  const NavCoin = styled(Coin).attrs((props: HasDirection) => ({
    color: colors.orderedCoin,
    disabled: twelve,
    onPress: () => handleCoinPress(props.direction)
  }))<HasDirection>``;

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 4],
    outputRange: ['0deg', '360deg']
  });

  return (
    <LevelContainer>
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
              if (index === 0) {
                const { top: translateY, left: translateX } = moveAnim.getLayout();
                children = (
                  <MouseContainer style={{transform: [
                    {translateY},
                    {translateX},
                    {rotate},
                  ]}} >
                    <Mouse />
                    <LevelCounter
                      count={numCoinsFound}
                      color={colors.offCoin}
                      width={mazeTileSize}
                      height={mazeTileSize}
                      position={{ left: styles.levelTextSize / 4, bottom: mazeTileSize / 6 }}
                      fontSize={styles.levelTextSize / 2}
                    />
                  </MouseContainer>
                )
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

import React, { memo, FunctionComponent, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Animated, Easing } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'res/styles';
import colors from 'res/colors';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const { coinSize } = styles;

const finalImage = require('assets/images/12-opaque-4-3.png');
const images = [
  require('assets/images/12-partition-4-3/0.png'),
  require('assets/images/12-partition-4-3/1.png'),
  require('assets/images/12-partition-4-3/2.png'),
  require('assets/images/12-partition-4-3/3.png'),
  require('assets/images/12-partition-4-3/4.png'),
  require('assets/images/12-partition-4-3/5.png'),
  require('assets/images/12-partition-4-3/6.png'),
  require('assets/images/12-partition-4-3/7.png'),
  require('assets/images/12-partition-4-3/8.png'),
  require('assets/images/12-partition-4-3/9.png'),
  require('assets/images/12-partition-4-3/10.png'),
  require('assets/images/12-partition-4-3/11.png'),
];

const numRows = 3;
const numCols = 4;
const tileSize = Math.floor(levelWidth / (numCols + 1));
const puzzleWidth = tileSize * (numCols + 1);
const puzzleHeight = tileSize * (numRows + 1);
const puzzleBorderWidth = tileSize / 2;
const innerPuzzleWidth = tileSize * numCols;
const innerPuzzleHeight = tileSize * numRows;
const tileImageBorderWidth = Math.round(coinSize / 24);
// TODO: Make this border color a global color for a "dark wood" color
const borderColor = colors.darkWood;

const PuzzleContainer = styled.View`
  width: ${puzzleWidth}px;
  height: ${puzzleHeight}px;
  border-width: ${puzzleBorderWidth}px;
  border-color: ${borderColor};
  flex-direction: row;
  flex-wrap: wrap;
`;

const TileTouchable = styled.TouchableHighlight`
  width: ${tileSize}px;
  height: ${tileSize}px;
`;

const TileImage = styled.Image.attrs({ fadeDuration: 0 })`
  width: ${tileSize}px;
  height: ${tileSize}px;
  border-width: ${tileImageBorderWidth}px;
  border-color: ${borderColor};
`;

const TileText = styled.Text`
  color: ${colors.darkText};
  background-color: ${colors.background}40;
  font-family: montserrat;
  font-size: ${tileSize / 3}px;
  margin-left: ${tileSize / 12}px;
  opacity: 0.75;
`;

const BlankTile = styled.View`
  width: ${tileSize}px;
  height: ${tileSize}px;
`;

const CoinsContainer = styled(Animated.View)`
  position: absolute;
  width: ${innerPuzzleWidth}px;
  height: ${innerPuzzleHeight}px;
  flex-direction: row;
  flex-wrap: wrap;
`;

const CoinContainer = styled.View`
  width: ${tileSize}px;
  height: ${tileSize}px;
  justify-content: center;
  align-items: center;
`;

const TwelveImage = styled.Image.attrs({
  source: finalImage,
  fadeDuration: 0,
})`
  position: absolute;
  width: ${innerPuzzleWidth}px;
  height: ${innerPuzzleHeight}px;
`;

// Initial tile order after moves RDRURDLDLLUU
const initTiles = [
  1, 3, 4, 8,
  10, 2, 6, 11,
  5, 9, 7, 0,
];

const correctTiles = [
  1, 2, 3, 4,
  5, 6, 7, 8,
  9, 10, 11, 0,
];

const initBitmap = initTiles.reduce((bitmap, tile, index) => {
  return bitmap | (Number(tile === correctTiles[index]) << index);
}, 0);

const correctBitmap = ~(-1 << 12);

interface TileProps {
  value: number;
  slideAnim: {
    x: Animated.Value;
    y: Animated.Value;
  };
  handleTilePressIn: () => any;
}

const Tile: FunctionComponent<TileProps> = memo((props) => {
  const { value, slideAnim, handleTilePressIn } = props;

  return (
    (value) ? (
      <Animated.View style={{
        transform: [
          { translateX: Animated.multiply(slideAnim.x, tileSize) },
          { translateY: Animated.multiply(slideAnim.y, tileSize) },
        ]
      }}>
        <TileTouchable onPressIn={handleTilePressIn}>
          <>
            <TileImage source={images[value]} />
            <Animated.View style={{ position: 'absolute' }}>
              <TileText>{value}</TileText>
            </Animated.View>
          </>
        </TileTouchable>
      </Animated.View>
    ) : (
      <BlankTile />
    )
  );
});

const LevelSlidingPuzzle: Level = (props) => {

  const [tiles, setTiles] = useState(initTiles);
  const [tileAnims] = useState(() => tiles.map(() => ({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
  })));
  const [coinOpacity] = useState(new Animated.Value(0));

  const bitmap = useRef<number>(initBitmap);
  const isSolved = bitmap.current === correctBitmap;

  useEffect(() => {
    if (!isSolved) return;
    Animated.timing(coinOpacity, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [isSolved]);

  const animate = (anim: Animated.Value, initValue: number) => {
    anim.setValue(initValue);
    Animated.timing(anim, {
      toValue: 0,
      duration: 1000 / 12,
      useNativeDriver: true,
    }).start();
  };

  const handleTilePress = useCallback((index: number) => {
    setTiles(tiles => {
      const row = Math.floor(index / numCols);
      const col = index % numCols;
      let blankIndex = -1;
      // Check tile to the right
      if (col < numCols - 1) {
        if (tiles[index + 1] === 0) {
          blankIndex = index + 1;
          animate(tileAnims[tiles[index]].x, -1);
        }
      }
      // Check tile below
      if (row < numRows - 1) {
        if (tiles[index + numCols] === 0) {
          blankIndex = index + numCols;
          animate(tileAnims[tiles[index]].y, -1);
        }
      }
      // Check tile to the left
      if (col > 0) {
        if (tiles[index - 1] === 0) {
          blankIndex = index - 1;
          animate(tileAnims[tiles[index]].x, 1);
        }
      }
      // Check tile above
      if (row > 0) {
        if (tiles[index - numCols] === 0) {
          blankIndex = index - numCols;
          animate(tileAnims[tiles[index]].y, 1);
        }
      }
      if (blankIndex === -1) return tiles;
      const index1 = Math.min(index, blankIndex);
      const index2 = Math.max(index, blankIndex);
      // Update bitmap at index1
      if (correctTiles[index1] === tiles[index2]) {
        bitmap.current |= (1 << index1);
      } else {
        bitmap.current &= (-1 ^ (1 << index1));
      }
      // Update bitmap at index2
      if (correctTiles[index2] === tiles[index1]) {
        bitmap.current |= (1 << index2);
      } else {
        bitmap.current &= (-1 ^ (1 << index2));
      }
      return [
        ...tiles.slice(0, index1),
        tiles[index2],
        ...tiles.slice(index1 + 1, index2),
        tiles[index1],
        ...tiles.slice(index2 + 1),
      ];
    });
  }, []);

  const handleTilePressArr = useMemo(() => {
    return tiles.map((_, index) => () => handleTilePress(index))
  }, []);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  // TODO: look into disabling the touchable when not adjacent to blank
  return (
    <LevelContainer>
      <PuzzleContainer>
        {tiles.map((value, index) => (
          <Tile
            key={value}
            value={value}
            slideAnim={tileAnims[value]}
            handleTilePressIn={handleTilePressArr[index]}
          />
        ))}
        {isSolved && (
          <CoinsContainer style={{ opacity: coinOpacity }}>
            <TwelveImage />
            {Array.from(Array(12), (_, index) => (
              <CoinContainer key={String(index)}>
                <Coin
                  found={props.coinsFound.has(index)}
                  onPress={() => props.onCoinPress(index)}
                />
              </CoinContainer>
            ))}
          </CoinsContainer>
        )}
      </PuzzleContainer>
      <LevelCounter count={numCoinsFound} />
    </LevelContainer>
  );
};

export default LevelSlidingPuzzle;

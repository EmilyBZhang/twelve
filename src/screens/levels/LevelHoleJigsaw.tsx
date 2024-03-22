import React, {
  FunctionComponent,
  memo,
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Animated, Easing, ImageURISource } from 'react-native';
import {
  State,
  Directions,
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import colors from 'res/colors';
import styles from 'res/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelCounter from 'components/LevelCounter';
import { getLevelDimensions } from 'utils/getDimensions';
import { randCoinPoint } from 'utils/random';

const jigsawImages = [
  require('assets/images/12-partition-3-3/0.png'),
  require('assets/images/12-partition-3-3/1.png'),
  require('assets/images/12-partition-3-3/2.png'),
  require('assets/images/12-partition-3-3/3.png'),
  require('assets/images/12-partition-3-3/4.png'),
  require('assets/images/12-partition-3-3/5.png'),
  require('assets/images/12-partition-3-3/6.png'),
  require('assets/images/12-partition-3-3/7.png'),
  require('assets/images/12-partition-3-3/8.png'),
] as Array<ImageURISource>;

const finalImage = require('assets/images/12-opaque-1-1.png');

const { coinSize } = styles;
const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const { UP, LEFT, RIGHT, DOWN } = Directions;

const boardSize = levelWidth;
const cellDims = 3;
const cellSize = boardSize / cellDims;

const largeStart = cellSize - coinSize / 2;
const smallStart = (cellSize - coinSize) / 2;
const horiCoinPositions = Array.from(Array(6), (_, index) => {
  const row = Math.floor(index / cellDims);
  const col = index % cellDims;
  return {
    top: largeStart + row * cellSize,
    left: smallStart + col * cellSize,
  };
});
const vertCoinPositions = Array.from(Array(6), (_, index) => {
  const row = index % cellDims;
  const col = Math.floor(index / cellDims);
  return {
    top: smallStart + row * cellSize,
    left: largeStart + col * cellSize,
  };
});
const coinPositions = [...horiCoinPositions, ...vertCoinPositions];

const CoinBoard = styled(Animated.View)`
  position: absolute;
  top: 0px;
  left: 0px;
  width: ${boardSize}px;
  height: ${boardSize}px;
  background-color: ${colors.lightWood};
`;

const FinalJigsaw = styled.Image.attrs({
  source: finalImage,
  width: boardSize,
  height: boardSize,
  fadeDuration: 0,
})`
  position: absolute;
  width: ${boardSize}px;
  height: ${boardSize}px;
`;

const CoinContainer = styled.View`
  position: absolute;
`;

const dropJigsawPiece = (absoluteX: number, absoluteY: number) => {
  const x = absoluteX;
  const y = absoluteY - styles.levelNavHeight;
  if (y >= boardSize || y < 0 || x >= boardSize || x < 0)
    return {
      index: -1,
      x: Math.max(0, Math.min(levelWidth - cellSize - 1, x)),
      y: Math.max(0, Math.min(levelHeight - cellSize - 1, y)),
    };
  const row = Math.floor(y / cellSize);
  const col = Math.floor(x / cellSize);
  return {
    index: row * cellDims + col,
    x: col * cellSize,
    y: row * cellSize,
  };
};

const holes = [
  RIGHT | DOWN,
  LEFT | RIGHT | DOWN,
  LEFT | DOWN,
  UP | RIGHT | DOWN,
  UP | LEFT | RIGHT | DOWN,
  UP | LEFT | DOWN,
  UP | RIGHT,
  UP | LEFT | RIGHT,
  UP | LEFT,
];

const Cell = styled.View`
  width: ${cellSize}px;
  height: ${cellSize}px;
  background-color: ${colors.plainSurface};
  border: 1px dotted ${colors.lightWood};
  border-radius: 1px;
`;

const JigsawContainer = styled.View`
  width: ${levelWidth}px;
  height: ${levelHeight}px;
  flex-direction: row;
  flex-wrap: wrap;
  position: absolute;
`;

const JigsawPieceContainer = styled(Animated.View)`
  position: absolute;
  top: 0px;
  left: 0px;
  width: ${cellSize}px;
  height: ${cellSize}px;
  background-color: ${colors.lightWood};
  justify-content: center;
  align-items: center;
  overflow: hidden;
  opacity: ${5 / 6};
  /* elevation: 12; */
`;

interface JigsawPieceImageProps {
  index: number;
}

const JigsawPieceImage = styled.Image.attrs<JigsawPieceImageProps>((props) => ({
  source: jigsawImages[props.index],
  fadeDuration: 0,
}))<JigsawPieceImageProps>`
  position: absolute;
  width: ${cellSize}px;
  height: ${cellSize}px;
`;

interface JigsawPieceProps {
  // Bitmap of Directions values as defined in react-native-gesture-handler
  directions: number;
  onPlace: (index: number) => any;
  index: number;
}

const anchors = {
  [UP]: { top: -coinSize / 2 },
  [LEFT]: { left: -coinSize / 2 },
  [RIGHT]: { right: -coinSize / 2 },
  [DOWN]: { bottom: -coinSize / 2 },
};

interface AnchoredCoinProps {
  direction: Directions;
}

const AnchoredCoin: FunctionComponent<AnchoredCoinProps> = (props) => {
  const { direction } = props;

  return (
    <Animated.View
      style={{
        ...anchors[direction],
        position: 'absolute',
      }}
    >
      <Coin color={colors.coin} disabled noShimmer />
    </Animated.View>
  );
};

const JigsawPiece: FunctionComponent<JigsawPieceProps> = memo((props) => {
  const { directions, onPlace, index } = props;

  const [active, setActive] = useState(false);

  // TODO: Add functionality in randCoinPoint to remove specifying all params
  const { x, y } = useMemo(
    () =>
      randCoinPoint({
        coinSize: cellSize,
        x0: 0,
        y0: boardSize,
        x1: levelWidth,
        y1: levelHeight,
      }),
    []
  );
  const [baseX] = useState(new Animated.Value(x));
  const [baseY] = useState(new Animated.Value(y));
  const [panX] = useState(new Animated.Value(0));
  const [panY] = useState(new Animated.Value(0));

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: panX, translationY: panY } }],
    { useNativeDriver: true }
  );

  const handleStateChange = (e: PanGestureHandlerStateChangeEvent) => {
    if (e.nativeEvent.state === State.END) {
      const { absoluteX, absoluteY, translationX, translationY } =
        e.nativeEvent;
      panX.setValue(0);
      panY.setValue(0);
      const { x, y, index } = dropJigsawPiece(absoluteX, absoluteY);
      if (index === -1) {
        baseX.setOffset(translationX);
        baseX.flattenOffset();
        baseY.setOffset(translationY);
        baseY.flattenOffset();
      } else {
        baseX.setValue(x);
        baseY.setValue(y);
      }
      onPlace(index);
      setActive(false);
    } else if (e.nativeEvent.state === State.BEGAN) {
      setActive(true);
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={handleGestureEvent}
      onHandlerStateChange={handleStateChange}
    >
      <JigsawPieceContainer
        style={{
          ...(active && {
            zIndex: 1,
            opacity: 1,
          }),
          transform: [
            { translateX: Animated.add(baseX, panX) },
            { translateY: Animated.add(baseY, panY) },
            { scaleX: active ? 7 / 6 : 1 },
            { scaleY: active ? 7 / 6 : 1 },
          ],
        }}
      >
        <JigsawPieceImage index={index} source={finalImage} />
        {!!(directions & UP) && <AnchoredCoin direction={UP} />}
        {!!(directions & LEFT) && <AnchoredCoin direction={LEFT} />}
        {!!(directions & RIGHT) && <AnchoredCoin direction={RIGHT} />}
        {!!(directions & DOWN) && <AnchoredCoin direction={DOWN} />}
      </JigsawPieceContainer>
    </PanGestureHandler>
  );
});

const initPieces = Array.from(Array(cellDims * cellDims), () => -1);

const LevelHoleJigsaw: Level = (props) => {
  const [anim] = useState(new Animated.Value(0));
  const [isRevealed, setIsRevealed] = useState(false);
  const pieces = useRef([...initPieces]);
  const numCorrect = useRef(0);

  const numCoinsFound = props.coinsFound.size;

  useEffect(() => {
    if (!isRevealed) return;
    Animated.timing(anim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [isRevealed]);

  // const handlePlace = (pieceIndex: number, slotIndex: number) => {
  //   const wasMatched = pieces.current[pieceIndex] === pieceIndex;
  //   const isMatched = pieceIndex === slotIndex;
  //   pieces.current[pieceIndex] = slotIndex;
  //   numCorrect.current += Number(isMatched) - Number(wasMatched);
  //   if (numCorrect.current === pieces.current.length) setIsRevealed(true);
  // };

  const onPlaceCallbacks = useMemo(
    () =>
      holes.map((_, pieceIndex) => (slotIndex: number) => {
        const wasMatched = pieces.current[pieceIndex] === pieceIndex;
        const isMatched = pieceIndex === slotIndex;
        pieces.current[pieceIndex] = slotIndex;
        numCorrect.current += Number(isMatched) - Number(wasMatched);
        if (numCorrect.current === pieces.current.length) setIsRevealed(true);
      }),
    []
  );

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <JigsawContainer>
        {holes.map((_, index) => (
          <Cell key={String(index)} />
        ))}
        {holes.map((hole, index) => (
          <JigsawPiece
            key={String(index)}
            directions={hole}
            onPlace={onPlaceCallbacks[index]}
            index={index}
          />
        ))}
      </JigsawContainer>
      {isRevealed && (
        <CoinBoard style={{ opacity: anim }}>
          <FinalJigsaw />
          {coinPositions.map((coinPosition, index) => (
            <CoinContainer key={String(index)} style={coinPosition}>
              <Coin
                found={props.coinsFound.has(index)}
                onPress={() => props.onCoinPress(index)}
              />
            </CoinContainer>
          ))}
        </CoinBoard>
      )}
    </LevelContainer>
  );
};

export default LevelHoleJigsaw;

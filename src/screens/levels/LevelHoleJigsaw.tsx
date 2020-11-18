import React, { useState, useMemo, FunctionComponent } from 'react';
import { Animated, Text } from 'react-native';
import {
  State,
  Directions,
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import colors from 'assets/colors';
import styles from 'assets/styles';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import { getLevelDimensions } from 'utils/getDimensions';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { randCoinPoint } from 'utils/random';

const { coinSize } = styles;
const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const { UP, LEFT, RIGHT, DOWN } = Directions;

const boardSize = levelWidth;
const yCutoff = boardSize;
const cellDims = 3;
const cellSize = boardSize / cellDims;

const dropJigsawPiece = (absoluteX: number, absoluteY: number) => {
  const x = absoluteX;
  const y = absoluteY - styles.levelNavHeight;
  if (y >= boardSize || y < 0 || x >= boardSize || x < 0) return ({
    index: -1,
    x: Math.max(0, Math.min(levelWidth - cellSize - 1, x)),
    y: Math.max(0, Math.min(levelHeight - cellSize - 1, y)),
  });
  const row = Math.floor(y / cellSize);
  const col = Math.floor(x / cellSize);
  return ({
    index: row * cellDims + col,
    x: col * cellSize,
    y: row * cellSize,
  });
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
  background-color: ${colors.lightWood};
  border: 4px solid ${colors.darkWood};
`;

const JigsawContainer = styled.View`
  width: ${levelWidth}px;
  height: ${levelHeight}px;
  flex-direction: row;
  flex-wrap: wrap;
  position: absolute;
`;

const Board = styled.View`
  width: ${boardSize};
  height: ${boardSize};
  flex-direction: row;
  flex-wrap: wrap;
  position: absolute;
  top: 0px;
`;

const JigsawPieceContainer = styled(Animated.View)`
  position: absolute;
  top: 0px;
  left: 0px;
  width: ${cellSize}px;
  height: ${cellSize}px;
  background-color: ${colors.selectCoin};
  justify-content: center;
  align-items: center;
  overflow: hidden;
  opacity: 0.75;
`;

interface JigsawPieceProps {
  revealed: boolean;
  // Bitmap of Directions values as defined in react-native-gesture-handler
  directions: number;
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
    <Animated.View style={{
      ...anchors[direction],
      position: 'absolute',
    }}>
      <Coin />
    </Animated.View>
  );
};

const JigsawPiece: FunctionComponent<JigsawPieceProps> = (props) => {
  const { revealed, directions } = props;

  // TODO: Add functionality in randCoinPoint to remove specifying all params
  const { x, y } = useMemo(() => randCoinPoint({
    coinSize: cellSize,
    x0: 0,
    y0: boardSize,
    x1: levelWidth,
    y1: levelHeight,
  }), []);
  const [baseX] = useState(new Animated.Value(x));
  const [baseY] = useState(new Animated.Value(y));
  const [panX] = useState(new Animated.Value(0));
  const [panY] = useState(new Animated.Value(0));

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: panX, translationY: panY }}],
    { useNativeDriver: true }
  );

  const handleStateChange = (e: PanGestureHandlerStateChangeEvent) => {
    if (e.nativeEvent.state === State.END) {
      const { absoluteX, absoluteY, translationX, translationY } = e.nativeEvent;
      console.log(absoluteX, absoluteY);
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
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={handleGestureEvent}
      onHandlerStateChange={handleStateChange}
    >
      <JigsawPieceContainer style={{ transform: [
        { translateX: Animated.add(baseX, panX) },
        { translateY: Animated.add(baseY, panY) },
      ]}} >
        {!revealed && (
          <>
            {!!(directions & UP) && <AnchoredCoin direction={UP} />}
            {!!(directions & LEFT) && <AnchoredCoin direction={LEFT} />}
            {!!(directions & RIGHT) && <AnchoredCoin direction={RIGHT} />}
            {!!(directions & DOWN) && <AnchoredCoin direction={DOWN} />}
          </>
        )}
      </JigsawPieceContainer>
    </PanGestureHandler>
  );
};

const LevelHoleJigsaw: Level = (props) => {

  const [anim] = useState(new Animated.Value(1));

  const scale = Animated.add(1, Animated.multiply(2, anim));

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const handlePress = () => {
    // Animated.event([{scale: anim}])({scale: 1.2}, {useNativeDriver: true});
    Animated.timing(anim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <JigsawContainer>
        <Cell />
        <Cell />
        <Cell />
        <Cell />
        <Cell />
        <Cell />
        <Cell />
        <Cell />
        <Cell />
        {holes.map((hole, index) => (
          <JigsawPiece key={String(index)} revealed={false} directions={hole} />
        ))}
      </JigsawContainer>
      {/* <TouchableOpacity onPress={handlePress}>
        <Square style={{
          transform: [{scaleX: scale}, {scaleY: scale}]
        }} />
      </TouchableOpacity> */}
    </LevelContainer>
  );
};

export default LevelHoleJigsaw;

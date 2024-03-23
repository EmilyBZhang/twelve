import React, {
  FunctionComponent,
  memo,
  useState,
  useRef,
  useCallback,
} from 'react';
import { Animated, View } from 'react-native';
import {
  State,
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Polyline } from 'react-native-svg';
import styled from 'styled-components/native';
import Constants from 'expo-constants';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'res/styles';
import colors from 'res/colors';
// import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelCounter from 'components/LevelCounter';
import { HintIcon } from 'components/LevelNav/components';
import playAudio from 'utils/playAudio';
import { MaterialCommunityIconsProps } from 'utils/types';

const zapSound = require('assets/sfx/zap.mp3');

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

const margin = coinSize;
const midX = circuitWidth / 2;
const midY =
  baseY + segmentLength * 3 + styles.levelNavHeight + Constants.statusBarHeight;
const bounds = {
  minX: midX - margin,
  maxX: midX + margin,
  minY: midY - margin,
  maxY: midY + margin,
};

const withinBounds = (x: number, y: number) =>
  x >= bounds.minX && x <= bounds.maxX && y >= bounds.minY && y <= bounds.maxY;

const coinPositions = Array.from(Array(12), (_, index) => {
  const yIndex = Math.floor(index / 2) + 1;
  const xShift = Math.round(-Math.cos((Math.floor(index / 2) * Math.PI) / 2));
  const xBase = leftX - coinSize / 2 + ((xShift + 1) * segmentLength) / 2;
  return {
    ...(index % 2 ? { right: xBase } : { left: xBase }),
    top: baseY + (segmentLength * yIndex) / 2 - coinSize / 2,
  };
});

const BatteryIcon = styled(MaterialCommunityIcons).attrs({
  name: 'car-battery',
  size: coinSize,
  color: colors.foreground,
})<Partial<MaterialCommunityIconsProps>>`
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

const HintBulbContainer = styled(Animated.View)`
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: ${styles.levelNavZIndex};
  width: ${styles.levelNavHeight}px;
  height: ${styles.levelNavHeight}px;
  justify-content: center;
  align-items: center;
`;

interface HintBulbProps {
  locked: boolean;
  onPlace: () => any;
  onPress: () => any;
}

const HintBulb: FunctionComponent<HintBulbProps> = memo((props) => {
  const { onPlace, onPress, locked } = props;

  const [active, setActive] = useState(false);
  const [baseX] = useState(new Animated.Value(0));
  const [baseY] = useState(new Animated.Value(0));
  const [panX] = useState(new Animated.Value(0));
  const [panY] = useState(new Animated.Value(0));

  const panRef = useRef();
  const tapRef = useRef();

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: panX, translationY: panY } }],
    { useNativeDriver: false }
  );

  const handleStateChange = useCallback(
    (e: PanGestureHandlerStateChangeEvent) => {
      if (e.nativeEvent.state === State.END) {
        const { absoluteX, absoluteY, translationX, translationY } =
          e.nativeEvent;
        panX.setValue(0);
        panY.setValue(0);
        if (withinBounds(absoluteX, absoluteY)) {
          onPlace();
          baseX.setValue(midX + styles.levelNavHeight / 2 - levelWidth);
          baseY.setValue(
            midY - styles.levelNavHeight / 2 - Constants.statusBarHeight
          );
        } else {
          baseX.setOffset(translationX);
          baseX.flattenOffset();
          baseY.setOffset(translationY);
          baseY.flattenOffset();
        }
        setActive(false);
      } else if (e.nativeEvent.state === State.BEGAN) {
        setActive(true);
      }
    },
    []
  );

  const handleTap = useCallback((e: TapGestureHandlerStateChangeEvent) => {
    if (e.nativeEvent.state === State.END) onPress();
  }, []);

  return (
    <PanGestureHandler
      enabled={!locked}
      onGestureEvent={handleGestureEvent}
      onHandlerStateChange={handleStateChange}
      simultaneousHandlers={[tapRef]}
    >
      <TapGestureHandler
        onHandlerStateChange={handleTap}
        simultaneousHandlers={[panRef]}
      >
        <HintBulbContainer
          style={{
            transform: [
              { translateX: Animated.add(baseX, panX) },
              { translateY: Animated.add(baseY, panY) },
              { scale: active ? 13 / 12 : 1 },
            ],
            ...(locked && { zIndex: 1 }),
          }}
        >
          <HintIcon />
        </HintBulbContainer>
      </TapGestureHandler>
    </PanGestureHandler>
  );
});

const Circuit: FunctionComponent = memo(() => (
  <>
    <CircuitContainer>
      <Polyline
        points={polylinePoints}
        stroke={colors.offCoin}
        strokeWidth={styles.coinSize / 12}
        fill="transparent"
      />
    </CircuitContainer>
    <BatteryIcon />
  </>
));

const LevelCircuit: Level = (props) => {
  const [circuitComplete, setCircuitComplete] = useState(false);
  const [hintModalOpen, setHintModelOpen] = useState(false);

  const handlePlace = useCallback(() => {
    setCircuitComplete(true);
    playAudio(zapSound);
  }, []);
  const handlePress = useCallback(() => props.setHintOpen(true), []);
  // const handleClose = useCallback(() => setHintModelOpen(false), []);

  const handleCoinPress = (index: number) => props.onCoinPress(index);
  // const handleCoinPress = (index: number) => circuitComplete && props.onCoinPress(index);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  return (
    <>
      {!twelve && (
        <HintBulbContainer style={{ backgroundColor: colors.background }} />
      )}
      <HintBulb
        locked={circuitComplete}
        onPlace={handlePlace}
        onPress={handlePress}
      />
      <LevelContainer>
        <LevelCounter count={numCoinsFound} />
        <Circuit />
        {coinPositions.map((coinPosition, index) => (
          <View
            key={String(index)}
            style={{ position: 'absolute', ...coinPosition }}
          >
            <Coin
              disabled={!circuitComplete}
              color={circuitComplete ? colors.coin : colors.offCoin}
              found={props.coinsFound.has(index)}
              onPress={() => handleCoinPress(index)}
            />
          </View>
        ))}
      </LevelContainer>
    </>
  );
};

export default LevelCircuit;

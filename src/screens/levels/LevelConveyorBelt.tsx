import React, { FunctionComponent, memo, useState, useEffect, useRef, useCallback } from 'react';
import { Animated, Easing, View } from 'react-native';
import {
  State,
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import Constants from 'expo-constants';

import { Level } from 'utils/interfaces';
import getDimensions, { getLevelDimensions } from 'utils/getDimensions';
import styles from 'res/styles';
import colors from 'res/colors';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelCounter from 'components/LevelCounter';
import { navIconSize, SettingsIcon } from 'components/LevelNav/components'

const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const { width: windowWidth, height: windowHeight } = getDimensions();
const { coinSize } = styles;

// const trueGearWidth = navIconSize * 5/6;
const gearSize = navIconSize;
const numGears = 12;

const missingGearIndex = 8;
const margin = coinSize;
const midX = windowWidth * missingGearIndex / numGears + levelWidth / numGears / 2;
const midY = (windowHeight + coinSize) / 2;
const bounds = {
  minX: midX - margin,
  maxX: midX + margin,
  minY: midY - margin,
  maxY: midY + margin,
};

const withinBounds = (x: number, y: number) => (
  x >= bounds.minX && x <= bounds.maxX && y >= bounds.minY && y <= bounds.maxY
);

const gearPeriod = 1000;
const gearCircumference = gearSize * Math.PI;
const beltLength = levelWidth * 3;
const beltPeriod = gearPeriod * beltLength / gearCircumference;

const GearRow = styled.View`
  flex-direction: row;
  overflow: visible;
  width: 100%;
  justify-content: space-around;
`;

const SettingsGearContainer = styled(Animated.View)`
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: ${styles.levelNavZIndex};
  width: ${styles.levelNavHeight}px;
  height: ${styles.levelNavHeight}px;
  justify-content: center;
  align-items: center;
`;

const GearContainer = styled(Animated.View)``;

const Gear = SettingsIcon;

const beltsPerChunk = 4;
const beltWidth = levelWidth * 3;

const BeltSegment = styled.View`
  width: ${levelWidth / beltsPerChunk}px;
  height: ${navIconSize / 2}px;
  background-color: darkslateblue;
  border: ${navIconSize / 12}px solid steelblue;
`;

const ChunkRow = styled.View`
  width: ${levelWidth}px;
  flex-direction: row;
  justify-content: space-around;
`;

const SegmentRow = memo(() => (
  <ChunkRow>
    {Array.from(Array(beltsPerChunk), (_, index) => <BeltSegment key={String(index)} />)}
  </ChunkRow>
));

const BeltChunk = styled(Animated.View)`
  flex-direction: column-reverse;
  justify-content: flex-start;
`;

const BeltContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: ${beltWidth}px;
`;

interface BeltProps {
  active?: boolean;
  children1?: React.ReactNode;
  children2?: React.ReactNode;
  children3?: React.ReactNode;
}

const ReverseContainer = styled.View`
  transform: rotate(180deg);
`;

const BeltsContainer = styled.View`
  position: absolute;
  width: ${levelWidth}px;
  justify-content: center;
  align-items: center;
`;

const Belt: FunctionComponent<BeltProps> = memo((props) => {
  const { active } = props;

  const [anim] = useState(new Animated.Value(0));
  const { children1, children2, children3 } = props;

  useEffect(() => {
    if (!active) return;
    Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: beltPeriod,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [active]);

  const baseTranslate = Animated.multiply(anim, beltWidth);
  const translates = [
    baseTranslate,
    Animated.subtract(Animated.modulo(Animated.add(baseTranslate, levelWidth), beltWidth), levelWidth),
    Animated.subtract(Animated.modulo(Animated.add(baseTranslate, levelWidth * 2), beltWidth), levelWidth * 2),
  ];

  return (
    <BeltContainer>
      <BeltChunk style={{ transform: [{ translateX: translates[0] }] }}>
        <SegmentRow />
        <ChunkRow>
          {children1}
        </ChunkRow>
      </BeltChunk>
      <BeltChunk style={{ transform: [{ translateX: translates[1] }] }}>
        <SegmentRow />
        <ChunkRow>
          {children2}
        </ChunkRow>
      </BeltChunk>
      <BeltChunk style={{ transform: [{ translateX: translates[2] }] }}>
        <SegmentRow />
        <ChunkRow>
          {children3}
        </ChunkRow>
      </BeltChunk>
    </BeltContainer>
  );
});

interface SettingsGearProps {
  anim: Animated.Value;
  locked: boolean;
  onPlace: () => any;
  onPress: () => any;
}

const SettingsGear: FunctionComponent<SettingsGearProps> = memo((props) => {
  const { onPlace, onPress, locked, anim } = props;

  const [active, setActive] = useState(false);
  const [baseX] = useState(new Animated.Value(0));
  const [baseY] = useState(new Animated.Value(0));
  const [panX] = useState(new Animated.Value(0));
  const [panY] = useState(new Animated.Value(0));

  const panRef = useRef();
  const tapRef = useRef();

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: panX, translationY: panY }}],
    { useNativeDriver: false }
  );

  const handleStateChange = useCallback((e: PanGestureHandlerStateChangeEvent) => {
    if (e.nativeEvent.state === State.END) {
      const { absoluteX, absoluteY, translationX, translationY } = e.nativeEvent;
      panX.setValue(0);
      panY.setValue(0);
      if (withinBounds(absoluteX, absoluteY)) {
        baseX.setValue(midX - styles.levelNavHeight / 2);
        baseY.setValue(midY - styles.levelNavHeight / 2);
        onPlace();
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
  }, []);

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
        <SettingsGearContainer style={{
          transform: [
            { translateX: Animated.add(baseX, panX) },
            { translateY: Animated.add(baseY, panY) },
            { scale: active ? 13/12 : 1 },
            { rotate: anim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            }) }
          ],
          ...(locked && { zIndex: 1 })
        }}>
          <Gear />
        </SettingsGearContainer>
      </TapGestureHandler>
    </PanGestureHandler>
  );
});

const AlignedContainer = styled.View`
  height: ${windowHeight}px;
  width: 100%;
  justify-content: center;
  align-items: center;
  position: absolute;
`;

const LevelConveyorBelt: Level = (props) => {
  const [gearAnim] = useState(new Animated.Value(0));
  const [beltActive, setBeltActive] = useState(false);

  useEffect(() => {
    if (!beltActive) return;
    Animated.loop(
      Animated.timing(gearAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [beltActive]);

  const handleSettingsGearPress = useCallback(() => props.setSettingsOpen(true), []);
  const handleSettingsGearPlace = useCallback(() => setBeltActive(true), []);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  const rotate = gearAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderRow = (row: number) => Array.from(Array(4), (_, col) => {
    const index = row * 4 + col;
    const found = props.coinsFound.has(index);
    return (
      <Coin
        key={String(index)}
        hidden={found}
        disabled={found}
        onPress={() => props.onCoinPress(index)}
      />
    );
  });

  console.log(Constants.statusBarHeight, styles.levelTopMargin - styles.levelNavHeight);

  return (
    <>
      {!twelve && <SettingsGearContainer style={{ backgroundColor: colors.background }} />}
      <SettingsGear
        onPlace={handleSettingsGearPlace}
        locked={beltActive}
        anim={gearAnim}
        onPress={handleSettingsGearPress}
      />
      <LevelContainer>
        <LevelCounter count={numCoinsFound} />
      </LevelContainer>
        <AlignedContainer>
          <BeltsContainer>
            <Belt
              active={beltActive}
              children1={renderRow(0)}
              children2={renderRow(1)}
              children3={renderRow(2)}
            />
            <GearRow>
              {Array.from(Array(numGears), (_, index) => (
                <GearContainer
                  key={String(index)}
                  style={{
                    transform: [{ rotate }],
                    opacity: (index === missingGearIndex) ? 0 : 1
                  }}
                >
                  <Gear />
                </GearContainer>
              ))}
            </GearRow>
            <ReverseContainer>
              <Belt active={beltActive} />
            </ReverseContainer>
          </BeltsContainer>
        </AlignedContainer>
    </>
  );
};

export default LevelConveyorBelt;

import React, { FunctionComponent, useState, useRef, useMemo, useEffect } from 'react';
import { Animated, Easing, PanResponder, View } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import { calcPositions } from 'utils/coinPositions';
import styles from 'assets/styles';
import colors from 'assets/colors';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const unitSize = styles.coinSize;

const towerDims = {
  width: levelWidth / 2,
  height: levelHeight * 2 / 3,
};
const inventoryDims = {
  width: towerDims.width * 2,
  height: levelHeight - towerDims.height,
};

const coinPositions = calcPositions(2, 6, {
  containerWidth: inventoryDims.width,
  containerHeight: inventoryDims.height,
});

enum Slots {
  LEFT,
  RIGHT,
  INVENTORY,
}

const LeftArea = styled.View`
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: ${colors.selectCoin}80;
  width: ${towerDims.width}px;
  height: ${towerDims.height}px;
  flex-direction: column-reverse;
  align-items: center;
`;

const RightArea = styled.View`
  position: absolute;
  top: 0px;
  right: 0px;
  background-color: ${colors.orderedCoin}80;
  width: ${towerDims.width}px;
  height: ${towerDims.height}px;
  flex-direction: column-reverse;
  align-items: center;
`;

const Inventory = styled.View`
  position: absolute;
  left: 0px;
  bottom: 0px;
  background-color: ${colors.badCoin}80;
  width: ${inventoryDims.width}px;
  height: ${inventoryDims.height}px;
  flex-direction: row;
  flex-wrap: wrap;
`;

const CoinsContainer = styled(Animated.View)`
  position: absolute;
  background-color: ${colors.background};
  width: ${inventoryDims.width}px;
  height: ${inventoryDims.height}px;
`;

const blockWeights = [1, 1, 1, 5, 5, 5, 6];
const totalWeight = blockWeights.reduce((sum, weight) => sum + weight, 0);

const blockColors = {
  1: '#4040ff',
  5: '#0000bf',
  6: '#000080',
} as {[weight: number]: string};

const BlockContainer = styled(Animated.View)`
  justify-content: center;
  align-items: center;
  margin: 1px;
`;

const BlockLabelText = styled.Text`
  font-family: montserrat-bold;
  color: ${colors.lightText};
  text-align: center;
`;

interface BlockProps {
  weight: number;
  onDrop: (slot: Slots) => any;
}

const Block: FunctionComponent<BlockProps> = (props) => {
  const { weight, onDrop } = props;
  
  const [pan] = useState(new Animated.ValueXY());
  const [isGrabbing, setIsGrabbing] = useState(false);

  const panValue = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const listener = pan.addListener(value => { panValue.current = value });
    return () => pan.removeListener(listener);
  }, [pan]);

  const size = unitSize * Math.sqrt(weight);

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset(panValue.current);
      setIsGrabbing(true);
    },
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }]),
    onPanResponderRelease: (e) => {
      pan.flattenOffset();
      pan.setValue({ x: 0, y: 0 });
      setIsGrabbing(false);
      if (e.nativeEvent.pageY >= styles.levelNavHeight + towerDims.height) {
        onDrop(Slots.INVENTORY);
      } else if (e.nativeEvent.pageX < towerDims.width) {
        onDrop(Slots.LEFT);
      } else {
        onDrop(Slots.RIGHT);
      }
    }
  }), [onDrop]);

  return (
    <BlockContainer {...panResponder.panHandlers} style={{
      width: size,
      height: size,
      backgroundColor: blockColors[weight] || colors.coin,
      transform: [
        { translateX: pan.x },
        { translateY: pan.y },
        { scaleX: isGrabbing ? 7/6 : 1 },
        { scaleY: isGrabbing ? 7/6 : 1 },
      ],
      zIndex: isGrabbing ? 2 : 1,
    }}>
      <BlockLabelText style={{
        fontSize: size / 2,
      }}>
        {weight}
      </BlockLabelText>
    </BlockContainer>
  );
};

const LevelBalance: Level = (props) => {

  const [leftTower, setLeftTower] = useState<Array<number>>([]);
  const [rightTower, setRightTower] = useState<Array<number>>([]);
  const [inventory, setInventory] = useState(blockWeights);

  const [coinOpacity] = useState(new Animated.Value(0));

  const totals = useRef({
    [Slots.LEFT]: 0,
    [Slots.RIGHT]: 0,
    [Slots.INVENTORY]: totalWeight,
  }).current;

  const isSolved = totals[Slots.LEFT] === 12 && totals[Slots.RIGHT] === 12;

  useEffect(() => {
    if (!isSolved) return;
    Animated.timing(coinOpacity, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [isSolved]);

  const handleDropInSlot = (newSlot: Slots, weight: number) => {
    totals[newSlot] += weight;
    const pushStack = (tower: Array<number>) => [...tower, weight];
    switch (newSlot) {
      case Slots.LEFT: setLeftTower(pushStack); break;
      case Slots.RIGHT: setRightTower(pushStack); break;
      default: setInventory(pushStack);
    }
  };

  const towerPointerEvents = isSolved ? 'none' : 'auto';

  const numCoinsFound = props.coinsFound.size;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <LeftArea pointerEvents={towerPointerEvents}>
        {leftTower.map((weight, index) => (
          <Block
            key={String(index)}
            weight={weight}
            onDrop={(newSlot: Slots) => {
              totals[Slots.LEFT] -= weight;
              setLeftTower(leftTower => [
                ...leftTower.slice(0, index),
                ...leftTower.slice(index + 1),
              ]);
              handleDropInSlot(newSlot, weight);
            }}
          />
        ))}
      </LeftArea>
      <RightArea pointerEvents={towerPointerEvents}>
        {rightTower.map((weight, index) => (
          <Block
            key={String(index)}
            weight={weight}
            onDrop={(newSlot: Slots) => {
              totals[Slots.RIGHT] -= weight;
              setRightTower(rightTower => [
                ...rightTower.slice(0, index),
                ...rightTower.slice(index + 1),
              ]);
              handleDropInSlot(newSlot, weight);
            }}
          />
        ))}
      </RightArea>
      <Inventory>
        {inventory.map((weight, index) => (
          <Block
            key={String(index)}
            weight={weight}
            onDrop={(newSlot: Slots) => {
              totals[Slots.INVENTORY] -= weight;
              setInventory(inventory => [
                ...inventory.slice(0, index),
                ...inventory.slice(index + 1),
              ]);
              handleDropInSlot(newSlot, weight);
            }}
          />
        ))}
        {isSolved && (
          <CoinsContainer style={{ opacity: coinOpacity }}>
            <LevelCounter count={numCoinsFound} />
            {coinPositions.map((coinPosition, index) => (
              <View
                key={String(index)}
                style={{ ...coinPosition, position: 'absolute' }}
              >
                <Coin
                  found={props.coinsFound.has(index)}
                  onPress={() => props.onCoinPress(index)}
                />
              </View>
            ))}
          </CoinsContainer>
        )}
      </Inventory>
    </LevelContainer>
  );
};

export default LevelBalance;

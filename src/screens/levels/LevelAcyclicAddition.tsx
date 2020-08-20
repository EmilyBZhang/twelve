import React, { useState, useEffect } from 'react';
import { Animated, View, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Rect, Defs, Marker, Path, Circle } from 'react-native-svg';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import colors from 'assets/colors';
import styles from 'assets/styles';
import styled from 'styled-components/native';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const svgSize = levelWidth;
const svgPadding = {
  x: (levelWidth - svgSize) / 2,
  y: (levelHeight - svgSize) / 2,
};

const unit = svgSize / 9;
const padding = styles.coinSize / 2;

const pulseMaxScale = 7/6;

const nodes = [
  {
    value: 0,
    x: padding + 4 * unit,
    y: padding,
  },
  {
    value: -2,
    x: padding + 2 * unit,
    y: padding + 2 * unit,
  },
  {
    value: 1,
    x: padding + 4 * unit,
    y: padding + 2 * unit,
  },
  {
    value: 1,
    x: padding + 6 * unit,
    y: padding + 2 * unit,
  },
  {
    value: 6,
    x: padding,
    y: padding + 4 * unit,
  },
  {
    value: 4,
    x: padding + 8 / 3 * unit,
    y: padding + 4 * unit,
  },
  {
    value: 7,
    x: padding + 16 / 3 * unit,
    y: padding + 4 * unit,
  },
  {
    value: 2,
    x: padding + 8 * unit,
    y: padding + 4 * unit,
  },
  {
    value: 6,
    x: padding + 2 * unit,
    y: padding + 6 * unit,
  },
  {
    value: -1,
    x: padding + 4 * unit,
    y: padding + 6 * unit,
  },
  {
    value: 1,
    x: padding + 6 * unit,
    y: padding + 6 * unit,
  },
  {
    value: 0,
    x: padding + 4 * unit,
    y: padding + 8 * unit,
  },
];

const graph = [
  [1, 2, 3],
  [4, 5],
  [5],
  [6],
  [8],
  [6, 8, 9],
  [7, 10],
  [10],
  [9, 11],
  [11],
  [11],
  [],
];

const edges = graph.flatMap((neighbors, index) => (
  neighbors.map(neighbor => [index, neighbor])
));

interface NodeTextProps {
  on?: boolean;
}

const NodeText = styled.Text<NodeTextProps>`
  font-family: montserrat;
  font-size: ${styles.coinSize / 2}px;
  color: ${props => props.on ? colors.offCoin : colors.onCoin};
`;

const Home = styled(MaterialCommunityIcons).attrs({
  name: 'home',
  color: colors.offCoin,
  size: styles.coinSize,
})``;

interface BatteryProps {
  selected: boolean;
  charge: number;
}

const Battery = styled(MaterialCommunityIcons).attrs<BatteryProps>(props => ({
  name:
    props.charge === 12 ? 'battery' :
    props.charge > 12 ? 'battery-alert' :
    props.charge <= 0 ? 'battery-outline' :
    `battery-${(Math.min(10, Math.max(2, props.charge)) - 1) * 10}`,
  color: props.selected ? (props.charge === 12 ? colors.coin : colors.badCoin) : colors.onCoin,
  size: styles.coinSize,
}))<BatteryProps>``;

const LevelAcyclicAddition: Level = (props) => {

  const [path, setPath] = useState([0]);
  const [pathEdges, setPathEdges] = useState<Array<[number, number]>>([]);
  const [total, setTotal] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [coinOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: pulseMaxScale,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    Animated.timing(coinOpacity, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [unlocked]);

  const handleSwitchPress = (index: number) => {
    setTotal(total => {
      const newTotal = total + nodes[index].value;
      if (index === graph.length - 1) {
        if (newTotal === 12) {
          setUnlocked(true);
        } else {
          setPath([0]);
          setPathEdges([]);
          return 0;
        }
      }
      setPath(path => [...path, index]);
      setPathEdges(pathEdges => [...pathEdges, [path[path.length - 1], index]]);
      return newTotal;
    });
  };

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <Svg pointerEvents={'none'} width={svgSize} height={svgSize}>
        <Defs>
          <Marker
            id={'OnArrow'}
            refX={4.5}
            refY={0.5}
            orient={'auto'}
          >
            <Path
              d={'M 0 0 L 1 0.5 L 0 1 z'}
              stroke={colors.onCoin}
              fill={colors.onCoin}
            />
          </Marker>
          <Marker
            id={'OffArrow'}
            refX={4.5}
            refY={0.5}
            orient={'auto'}
          >
            <Path
              d={'M 0 0 L 1 0.5 L 0 1 z'}
              stroke={colors.offCoin}
              fill={colors.offCoin}
            />
          </Marker>
        </Defs>
        {edges.map(([from, to]) => {
          const isOn = pathEdges.find(([i, j]) => i === from && j === to);
          return (
            <Path
              key={`${from},${to}`}
              stroke={isOn ? colors.onCoin : colors.offCoin}
              strokeWidth={styles.coinSize / 20}
              d={`M${nodes[from].x} ${nodes[from].y} L${nodes[to].x} ${nodes[to].y}`}
              markerEnd={`url(#${isOn ? 'On' : 'Off'}Arrow)`}
            />
          );
        })}
      </Svg>
      {nodes.map(({ value, x, y }, index) => {
        const isInPath = path.includes(index);
        const isDisabled = !graph[path[path.length - 1]].includes(index);
        const coinSize = styles.coinSize * ((index === 0 || index === 11) ? 2 : 1);
        const offset =
          (index === 0) ? { x: -styles.coinSize / 2, y: -styles.coinSize } :
          (index === 11) ? { x: -styles.coinSize / 2, y: 0 } :
          { x: 0, y: 0 };
        const scale = Animated.diffClamp(pulseAnim, 1, isDisabled ? 1 : pulseMaxScale);

        return (
          <Animated.View key={String(index)} style={{
            position: 'absolute',
            left: svgPadding.x - padding + x + offset.x,
            top: svgPadding.y - padding + y + offset.y,
            transform: [{ scaleX: scale }, { scaleY: scale }],
          }}>
            <Coin
              size={coinSize}
              color={isInPath ? colors.onCoin : colors.offCoin}
              colorHintOpacity={0}
              disabled={isDisabled}
              onPress={() => handleSwitchPress(index)}
            >
              {(index === 11) && (
                <Battery charge={total} selected={!isDisabled || isInPath} />
              )}
              {(index === 0) ? <Home /> : (
                <NodeText on={isInPath}>
                  {(index === graph.length - 1) ? total : value}
                </NodeText>
              )}
            </Coin>
            <Animated.View style={{ position: 'absolute', opacity: coinOpacity }}>
              <Coin
                size={coinSize}
                found={!unlocked || props.coinsFound.has(index)}
                onPress={() => props.onCoinPress(index)}
              />
            </Animated.View>
          </Animated.View>
        );
      })}
    </LevelContainer>
  );
};

export default LevelAcyclicAddition;

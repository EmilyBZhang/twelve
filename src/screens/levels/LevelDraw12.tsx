// Use the line drawer to recreate the wires from Level12Wire
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Animated, PanResponder, Easing } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';

import WirePart, { wirePartSize, WireType } from './components/WirePart';
import { Level } from 'utils/interfaces';
import getDimensions, { getLevelDimensions } from 'utils/getDimensions';
import { calcPositions } from 'utils/coinPositions';
import colors from 'res/colors';
import styles from 'res/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import { randInt } from 'utils/random';
import useSelectedIndices from 'hooks/useSelectedIndices';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const { width: windowWidth, height: windowHeight } = getDimensions();

const { coinSize } = styles;

interface Point {
  x: number;
  y: number;
}

// interface Line {
//   x1: number;
//   y1: number;
//   x2: number;
//   y2: number;
// }

const containerSize = wirePartSize * 3;

const LineDrawerContainer = styled.View`
  width: ${containerSize}px;
  height: ${containerSize}px;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: transparent;
`;

const CircuitContainer = styled.View.attrs({
  pointerEvents: 'none'
})`
  position: absolute;
  top: 0px;
  left: 0px;
  width: ${containerSize}px;
  height: ${containerSize}px;
  flex-direction: row;
  flex-wrap: wrap;
`;

const WirePartContainer = styled.View.attrs({
  pointerEvents: 'none'
})`
  background-color: transparent;
  width: ${wirePartSize}px;
  height: ${wirePartSize}px;
`;

const maxCoinSize = coinSize * 13 / 12;
const CoinContainer = styled(Animated.View)`
  position: absolute;
  width: ${wirePartSize}px;
  height: ${wirePartSize}px;
  justify-content: center;
  align-items: center;
`;

/**
 * Graph of the form:
 * G[0] = Edge(0, 1)
 * G[1] = Edge(0, 2), G[2] = Edge(1, 2)
 * ...
 * G[55] = Edge(0, 11), ..., G[65] = Edge(10, 11)
 */
const initGraph = Array<boolean>(66).fill(false);

const containerBounds = {
  x1: (windowWidth - containerSize) / 2,
  y1: styles.levelNavHeight + (windowHeight - containerSize) / 2,
  x2: (windowWidth + containerSize) / 2,
  y2: styles.levelNavHeight + (windowHeight + containerSize) / 2,
};

const { x1: minX, y1: minY, x2: maxX, y2: maxY } = containerBounds;

const jointPositions = Array.from(Array(9), (_, index) => ({
  x: (index % 3 + 0.5) * wirePartSize,
  y: (Math.floor(index / 3) + 0.5) * wirePartSize,
}));

const initY = minY - styles.levelNavHeight * 3 / 2;
const initX = minX;
const coinPositions = jointPositions.map((_, index) => ({
  top: initY + wirePartSize * Math.floor(index / 3),
  left: initX + wirePartSize * (index % 3)
}));

const calcPointIndexFromBox = (x: number, y: number) => {
  const r = Math.floor(y / wirePartSize);
  const c = Math.floor(x / wirePartSize);
  if (r < 0 || r >= 3 || c < 0 || c >= 3) return -1;
  return r * 3 + c;
};

const calcPointIndexFromPage = (x: number, y: number) => {
  return calcPointIndexFromBox(x - minX, y - minY);
};

const calcPointPosition = (x: number, y: number) => {
  const index = calcPointIndexFromPage(x, y);
  if (index === -1) return null;
  return jointPositions[index];
};

const calcPointFromIndex = (vertex: number) => {
  const r = Math.floor(vertex / 3);
  const c = vertex % 3;
  return ({
    x: (c + 0.5) * wirePartSize,
    y: (r + 0.5) * wirePartSize
  });
};

const calcTriangleNumber = (n: number) => n * (n + 1) / 2;
const calcNFromTriangle = (triangleNumber: number) => (
  (-1 + Math.sqrt(1 + 8 * triangleNumber)) / 2
);

/**
 * Returns the index in the graph containing Edge(vertex1, vertex2).
 * 
 * @param vertex1 Vertex #1 index
 * @param vertex2 Vertex #2 index
 */
const calcGraphIndex = (vertex1: number, vertex2: number) => {
  if (vertex1 === vertex2) return -1;
  const minVertex = Math.min(vertex1, vertex2);
  const maxVertex = Math.max(vertex1, vertex2);
  return calcTriangleNumber(maxVertex - 1) + minVertex;
};

/**
 * Reverses calcGraphIndex.
 * 
 * @param graphIndex Index in graph
 */
const calcVerticesFromIndex = (graphIndex: number) => {
  const maxVertex = Math.floor(calcNFromTriangle(graphIndex)) + 1;
  const minVertex = graphIndex - calcTriangleNumber(maxVertex - 1);
  return [minVertex, maxVertex];
};

const targetVertices = [
  [0, 3],
  [1, 2],
  [2, 5],
  [3, 6],
  [4, 5],
  [4, 7],
  [7, 8],
];

const targetEdges = new Set(targetVertices.map(
  ([vertex1, vertex2]) => calcGraphIndex(vertex1, vertex2)
));
const targetNumEdges = targetEdges.size;

const LevelDraw12: Level = (props) => {

  // TODO: Make a MobX observable ref for optimizing if needed
  const [graph, setGraph] = useState(() => initGraph.slice());
  // const [lines, setLines] = useState<Array<Line>>([]);
  const correctEdges = useRef(new Set<number>());
  const totalNumEdges = useRef(0);
  const [lineStartXY, setLineStartXY] = useState<Point | null>(null);
  const [lineEndXY, setLineEndXY] = useState<Point | null>(null);
  const [coinAnim] = useState(new Animated.Value(0));
  
  const coinsRevealed = targetNumEdges === totalNumEdges.current && (
    targetNumEdges === correctEdges.current.size
  );

  const numCoinsFound = props.coinsFound.size;

  useEffect(() => {
    if (!coinsRevealed) return;
    Animated.timing(coinAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  }, [coinsRevealed]);

  const toggleGraph = (vertex1: number, vertex2: number) => {
    const r1 = Math.floor(vertex1 / 3);
    const c1 = vertex1 % 3;
    const r2 = Math.floor(vertex2 / 3);
    const c2 = vertex2 % 3;
    const overlap = ((r2 - r1) % 2 === 0) && ((c2 - c1) % 2 === 0);
    let indices = [];
    if (overlap) {
      const vertexM = (vertex1 + vertex2) / 2;
      const minVertex = Math.min(vertex1, vertex2);
      const maxVertex = Math.max(vertex1, vertex2);
      const index1 = calcGraphIndex(minVertex, vertexM);
      const index2 = calcGraphIndex(vertexM, maxVertex);
      indices = [index1, index2];
      setGraph(state => [
        ...state.slice(0, index1),
        !state[index1],
        ...state.slice(index1 + 1, index2),
        !state[index2],
        ...state.slice(index2 + 1)
      ]);
    } else {
      const index = calcGraphIndex(vertex1, vertex2);
      indices = [index];
      setGraph(state => [
        ...state.slice(0, index),
        !state[index],
        ...state.slice(index + 1)
      ]);
    }
    indices.forEach(index => {
      totalNumEdges.current += graph[index] ? -1 : 1;
      if (correctEdges.current.has(index)) {
        correctEdges.current.delete(index);
      } else if (targetEdges.has(index)) {
        correctEdges.current.add(index);
      }
    });
  };

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: (e, gestureState) => !coinsRevealed,
    onStartShouldSetPanResponderCapture: (e, gestureState) => true,
    onMoveShouldSetPanResponder: (e, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (e, gestureState) => true,
    onPanResponderTerminationRequest: (e, gestureState) => true,
    onShouldBlockNativeResponder: (e, gestureState) => true,
    onPanResponderGrant: (e, gestureState) => {
      const { pageX: x, pageY: y } = e.nativeEvent;
      setLineStartXY(calcPointPosition(x, y));
    },
    onPanResponderMove: (e, gestureState) => {
      const { pageX: x, pageY: y } = e.nativeEvent;
      setLineEndXY(calcPointPosition(x, y));
    },
    onPanResponderRelease: (e, gestureState) => {
      setLineStartXY(null);
      setLineEndXY(null);
      if (!lineStartXY || !lineEndXY) return;
      const { x: x1, y: y1 } = lineStartXY;
      const { x: x2, y: y2 } = lineEndXY;
      const vertex1 = calcPointIndexFromBox(x1, y1);
      const vertex2 = calcPointIndexFromBox(x2, y2);
      if (vertex1 !== vertex2) toggleGraph(vertex1, vertex2);
    },
    onPanResponderTerminate: (e, gestureState) => {
    },
  }), [lineStartXY, lineEndXY, coinsRevealed]);

  const lines = graph.map((edge, index) => {
    if (!edge) return null;
    const [vertex1, vertex2] = calcVerticesFromIndex(index);
    const { x: x1, y: y1 } = calcPointFromIndex(vertex1);
    const { x: x2, y: y2 } = calcPointFromIndex(vertex2);
    return (
      <Line
        key={String(index)}
        stroke={colors.coin}
        strokeWidth={2}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
      />
    );
  });

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <LineDrawerContainer {...panResponder.panHandlers}>
        <CircuitContainer>
          {jointPositions.map((jointPosition, index) => (
            <WirePartContainer key={String(index)}>
              <WirePart
                type={WireType.joint}
                initOrientation={0}
                onOrientationChange={() => {}}
              />
            </WirePartContainer>
          ))}
          </CircuitContainer>
        <Svg pointerEvents={'none'} width={containerSize} height={containerSize}>
          {lines}
          {(lineStartXY && lineEndXY) && (
            <Line
              stroke={'black'}
              strokeWidth={2}
              x1={lineStartXY.x}
              y1={lineStartXY.y}
              x2={lineEndXY.x}
              y2={lineEndXY.y}
            />
          )}
        </Svg>
      </LineDrawerContainer>
      {coinsRevealed && coinPositions.map((coinPosition, index) => (
        <CoinContainer
          key={String(index)}
          style={{
            opacity: coinAnim,
            ...coinPosition
          }}
        >
          <Coin
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
            size={coinSize * ((index % 3 === 0) ? 0.75 : 1)}
          />
          {(index % 3 === 0 && !props.coinsFound.has(9 + index / 3)) && (
            <CoinContainer>
              <Coin
                found={props.coinsFound.has(9 + index / 3)}
                onPress={() => props.onCoinPress(9 + index / 3)}
                size={maxCoinSize}
              />
            </CoinContainer>
          )}
        </CoinContainer>
      ))}
    </LevelContainer>
  );
};

export default LevelDraw12;

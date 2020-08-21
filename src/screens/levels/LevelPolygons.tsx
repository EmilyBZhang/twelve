import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Polygon } from 'react-native-svg';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import { getLevelDimensions } from 'utils/getDimensions';
import { shuffleArray } from 'utils/random';
import colors from 'assets/colors';
import styles from 'assets/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const coinSize = styles.coinSize * 3;
const polygonSize = coinSize * 0.75;

interface PolygonContainerProps {
  size: number;
}

const PolygonContainer = styled(Svg).attrs<PolygonContainerProps>((props) => ({
  width: props.size,
  height: props.size,
}))<PolygonContainerProps>`
  /* margin: ${levelWidth % polygonSize / Math.floor(levelWidth / polygonSize + 1) / 2}px; */
`;

const PolygonGrid = styled.View`
  width: ${levelWidth}px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const getPolygonSize = (n: number) => levelWidth / 4 * Math.log(n + 1) / Math.log(13);

const getPolygon = (n: number) => {
  const size = getPolygonSize(n);
  const r = size / 2;
  if (n === 1) {
    return (
      <Circle
        fill={'black'}
        r={2}
        cx={r}
        cy={r}
      />
    )
  } else if (n === 2) {
    return (
      <Line
        stroke={'black'}
        strokeWidth={2}
        x1={r * 11 / 6}
        y1={r}
        x2={r / 6}
        y2={r}
      />
    );
  }
  // const angle = Math.PI * (n - 2) / n;
  const angle = Math.PI * 2 / n;
  const offset = (n % 2) ? (-Math.PI / 2) : ((n % 4) ? 0 : (angle / 2));
  const points = Array.from(Array(n), (_, index) => ({
    x: r + Math.cos(angle * index + offset) * r,
    y: r + Math.sin(angle * index + offset) * r,
  }));
  return (
    <Polygon
      fill={'white'}
      stroke={'black'}
      strokeWidth={2}
      points={points.reduce((accum, { x, y }) => accum + ` ${x},${y}`, '')}
    />
  );
};

const getStar = (n: number, size = polygonSize) => {
  const r = size / 2;
  const angle = Math.PI * 2 / n;
  const points = Array.from(Array(n), (_, index) => ({
    x: r + Math.cos(angle * index * 2) * r,
    y: r + Math.sin(angle * index * 2) * r,
  }));
  const pointsFromArray = (accum: string, { x, y }: {x: number, y: number}) => (
    accum + ` ${x},${y}`
  );
  if (n % 1) {
    return (
      <Polygon
        stroke={'black'}
        strokeWidth={1}
        points={points.reduce(pointsFromArray, '')}
      />
    );
  }
  for (let i = n / 2; i < n; ++i) {
    points[i] = ({
      x: r + Math.cos(angle * (i * 2 + 1)) * r,
      y: r + Math.sin(angle * (i * 2 + 1)) * r,
    });
  }
  return (
    <>
      <Polygon
        stroke={'black'}
        strokeWidth={1}
        points={points.slice(0, n / 2).reduce(pointsFromArray, '')}
      />
      <Polygon
        stroke={'black'}
        strokeWidth={1}
        points={points.slice(n / 2).reduce(pointsFromArray, '')}
      />
    </>
  );
};

const LevelPolygons: Level = (props) => {

  const polygons = useMemo(() => {
    const polygons = Array.from(Array(12), (_, index) => (
      [index, getPolygon(index + 1)] as [number, JSX.Element])
    );
    shuffleArray(polygons);
    return polygons;
  }, []);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const handleCoinPress = (index: number) => {
    if (index === numCoinsFound) {
      props.onCoinPress(index);
    } else {
      props.setCoinsFound(new Set());
    }
  };

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <PolygonGrid>
        {polygons.map(([index, polygonComponent]) => (
          <Coin
            key={String(index)}
            size={getPolygonSize(index + 1) * 4 / 3}
            color={colors.orderedCoin}
            found={props.coinsFound.has(index)}
            onPress={() => handleCoinPress(index)}
            colorHintOpacity={0}
          >
            <PolygonContainer size={getPolygonSize(index + 1)}>
              {polygonComponent}
            </PolygonContainer>
          </Coin>
        ))}
      </PolygonGrid>
      {/* {coinPositions.map((coinPosition, index) => (
        // <View
        //   key={String(index)}
        //   style={{position: 'absolute', ...coinPosition}}
        // >
        //   <Coin
        //     found={props.coinsFound.has(index)}
        //     onPress={() => props.onCoinPress(index)}
        //   />
        // </View>
      ))} */}
    </LevelContainer>
  );
};

export default LevelPolygons;

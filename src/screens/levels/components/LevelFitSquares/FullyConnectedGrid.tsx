import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import styled from 'styled-components/native';

import { getLevelDimensions } from 'utils/getDimensions';
import { calcTriangularNumber, calcInverseTriangularNumber, toDeg } from 'utils/math';
import colors from 'assets/colors';

export interface RevealedSquareProps {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface FullyConnectedGridProps {
  revealedSquares: Array<RevealedSquareProps>;
}

const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const cellSize = levelWidth / 4;
const containerSize = cellSize * 3;
const gridSize = cellSize * 2;
const gridStart = (containerSize - gridSize) / 2;

const GridContainer = styled(Svg).attrs({
  width: containerSize,
  height: containerSize,
})`
  position: absolute;
`;

const points = Array.from(Array(9), (_, index) => {
  const row = Math.floor(index / 3);
  const col = index % 3;
  return ({
    x: gridStart + col * cellSize,
    y: gridStart + row * cellSize,
  });
});

const lines = Array.from(Array(calcTriangularNumber(points.length - 1)), (_, index) => {
  const j = Math.floor(calcInverseTriangularNumber(index)) + 1;
  const i = index - calcTriangularNumber(j - 1);
  const { x: x1, y: y1 } = points[i];
  const { x: x2, y: y2 } = points[j];
  return (
    <Line
      key={String(index)}
      stroke={'black'}
      strokeWidth={2}
      {...{x1, x2, y1, y2}}
    />
  );
});

const RevealedSquare: FunctionComponent<RevealedSquareProps> = (props) => {
  const { x: xFrac, y: yFrac, scale, rotation } = props;
  const x = gridStart + xFrac * gridSize;
  const y = gridStart + yFrac * gridSize;
  const size = gridSize * scale;
  const originX = x + size / 2;
  const originY = y + size / 2;

  return (
    <Rect
      x={x}
      y={y}
      width={size}
      height={size}
      rotation={toDeg(rotation)}
      originX={originX}
      originY={originY}
      stroke={colors.coin}
      strokeWidth={2}
      fill={'#0000ff20'}
    />
  );
};

const FullyConnectedGrid: FunctionComponent<FullyConnectedGridProps> = (props) => {
  const { revealedSquares } = props;

  return (
    <GridContainer>
      {lines}
      {revealedSquares.map((revealedSquare, index) => (
        <RevealedSquare
          key={String(index)}
          {...revealedSquare}
        />
      ))}
    </GridContainer>
  );
};

export default FullyConnectedGrid;
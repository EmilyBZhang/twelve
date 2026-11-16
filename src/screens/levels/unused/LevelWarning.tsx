import React from 'react';
import { Button } from 'react-native';
import Svg, { Defs, Marker, Path, Rect, Circle, Line, Polygon } from 'react-native-svg';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import { getLevelDimensions } from 'utils/getDimensions';

const { width: levelWidth } = getLevelDimensions();

const allCoinSet = new Set(Array.from(Array(12), (_, index) => index));

const LevelWarning: Level = (props) => {

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  return (
    <LevelContainer>
      <LevelText hidden={twelve}>
        WARNING: All levels afterward are purely
        experimental and are not complete!
      </LevelText>
      <Button title={'Click here to win'} onPress={() => props.setCoinsFound(allCoinSet)} />
    </LevelContainer>
  );

  return (
    <LevelContainer>
      <LevelText hidden={twelve}>
        WARNING: All levels afterward are purely
        experimental and are not complete!
      </LevelText>
      <Svg width={levelWidth} height={levelWidth}>
        <Defs>
          <Marker
            id="Circle"
            viewBox="0 0 10 10"
            refX="0"
            refY="0"
            // markerUnits="strokeWidth"
            // markerWidth="4"
            // markerHeight="4"
            orient="auto"
          >
            <Circle r="10" stroke='green' />
            {/* <Path d="M 0 0 L 10 5 L 0 10 z" stroke={'black'} fill={'black'} /> */}
          </Marker>
          <Marker
            id={'Arrowhead'}
            refX={2}
            refY={1}
            orient={'auto'}
          >
            <Rect
              width={2}
              height={2}
              fill={'black'}
              strokeWidth={1}
            />
          </Marker>
          <Marker
            id="Triangle"
            viewBox="0 0 10 10"
            refX="0"
            refY="5"
            // @ts-ignore
            markerUnits="strokeWidth"
            markerWidth="4"
            markerHeight="3"
            orient="auto"
          >
            <Path d="M 0 0 L 10 5 L 0 10 z" stroke='black' fill='black' />
          </Marker>
        </Defs>
        <Rect
          x={0}
          y={0}
          width={levelWidth}
          height={levelWidth}
          fill={'none'}
          stroke={'red'}
          strokeWidth={10}
        />
        <Line
          stroke={'black'}
          strokeWidth={4}
          x1={levelWidth / 4}
          y1={levelWidth / 3}
          x2={levelWidth / 2}
          y2={levelWidth * 3/4}
          marker={'url(#Circle)'}
        />
        <Path
          d={`M${180} ${180} L${300} ${120}`}
          fill="none"
          stroke="black"
          strokeWidth="4"
          markerEnd="url(#Arrowhead)"
        />
        <Path
          d="M 100 75 L 200 75 L 250 125"
          fill="none"
          stroke="black"
          strokeWidth="10"
          markerEnd="url(#Triangle)"
        />
        {/* <Rect
          x="10"
          y="10"
          width="3980"
          height="1980"
          fill="none"
          stroke="blue"
          strokeWidth="10"
        />
        <Path
          d="M 1000 750 L 2000 750 L 2500 1250"
          fill="none"
          stroke="black"
          strokeWidth="100"
          markerEnd="url(#Triangle)"
        /> */}
      </Svg>
    </LevelContainer>
  );
};

export default LevelWarning;

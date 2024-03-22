import React, { FunctionComponent, memo, useState, useMemo, useRef } from 'react';
import { PanResponder, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import styled from 'styled-components/native';

import getDimensions from 'utils/getDimensions';
import colors from 'res/colors';
import styles from 'res/styles';

const { width: windowWidth, height: windowHeight } = getDimensions();

interface LineDrawerProps {}

interface Coordinates {
  x: number;
  y: number;
}

const LineDrawerContainer = styled.View.attrs({
  pointerEvents: 'box-none'
})`
  position: absolute;
  top: 0px;
  left: 0px;
`;

const LineDrawer: FunctionComponent<LineDrawerProps> = (props) => {
  // TODO: Play around with drawing lines
  const [lineStartXY, setLineStartXY] = useState<Coordinates | null>(null);
  const [lineEndXY, setLineEndXY] = useState<Coordinates | null>(null);

    const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: (e, gestureState) => true,
    onStartShouldSetPanResponderCapture: (e, gestureState) => true,
    onMoveShouldSetPanResponder: (e, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (e, gestureState) => true,
    onPanResponderTerminationRequest: (e, gestureState) => true,
    onShouldBlockNativeResponder: (e, gestureState) => true,
    onPanResponderGrant: (e, gestureState) => {
      const { pageX: x, pageY: y } = e.nativeEvent;
      setLineStartXY({x, y});
      setLineEndXY(null);
    },
    onPanResponderMove: (e, gestureState) => {
      const { pageX: x, pageY: y } = e.nativeEvent;
      setLineEndXY({x, y});
    },
    onPanResponderRelease: (e, gestureState) => {
    },
    onPanResponderTerminate: (e, gestureState) => {
    },
  }), []);

  return (
    <LineDrawerContainer
      {...panResponder.panHandlers}
    >
      <View style={{width: windowHeight, height: windowHeight, position: 'absolute', top: -styles.levelNavHeight, left: 0}}>
        <Svg pointerEvents={'box-none'} width={windowWidth} height={windowHeight}>
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
      </View>
    </LineDrawerContainer>
  );
};

export default memo(LineDrawer);

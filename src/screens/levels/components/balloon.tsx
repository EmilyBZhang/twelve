import React, { memo, FunctionComponent } from 'react';
import { Animated, View, Image } from 'react-native';
import Matter from 'matter-js';
import styled from 'styled-components';

import styles from 'res/styles';
import Coin from 'components/Coin';
import { getLevelDimensions } from 'utils/getDimensions';
import colors from 'res/colors';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const { coinSize } = styles;
export const balloonWidth = coinSize * 2;
export const balloonHeight = coinSize * 4;

export interface BodyComponentProps {
  body: Matter.Body;
  [prop: string]: any;
}

export const shouldUpdateMatterBody = (
  oldProps: BodyComponentProps,
  newProps: BodyComponentProps
) => {
  const { x: x1, y: y1 } = oldProps.body.position;
  const { x: x2, y: y2 } = newProps.body.position;
  return x1 !== x2 || y1 !== y2;
};

export const Balloon: FunctionComponent<BodyComponentProps> = memo((props) => {
  const { x, y } = props.body.position;

  return (
    <View
      pointerEvents={'none'}
      style={{
        position: 'absolute',
        top: y - balloonHeight / 2,
        left: x - balloonWidth / 2,
        transform: [{rotate: `${props.body.angle}rad`}]
      }}
    >
      <Image
        source={require('assets/images/balloon.gif')}
        resizeMode={'contain'}
        style={{
          width: balloonWidth,
          height: balloonHeight
        }}
      />
    </View>
  );
}, shouldUpdateMatterBody);

export const Ground: FunctionComponent<BodyComponentProps> = (props) => {
  const { min, max } = props.body.bounds;

  return (
    <View style={{
      position: 'absolute',
      backgroundColor: colors.selectCoin,
      top: min.y,
      left: min.x,
      width: max.x - min.x,
      height: max.y - min.y,
    }}/>
  );
};

export interface CoinContainerProps extends BodyComponentProps {
  visible: boolean;
}

export const CoinContainer: FunctionComponent<CoinContainerProps> = memo((props) => {
  const { body, visible } = props;
  const { x, y } = body.position;

  return (
    <View
      pointerEvents={'none'}
      style={{
        position: 'absolute',
        top: y - coinSize / 2,
        left: x - coinSize / 2
      }}
    >
      <Coin found={!visible} />
    </View>
  );
}, (a, b) => shouldUpdateMatterBody(a, b) || a.visible !== b.visible);

export const createBalloonBody = (x: number, y: number) => (
  Matter.Bodies.rectangle(x, y, balloonWidth, balloonHeight, { frictionAir: 0.25 })
);

export const createWalls = () => ({
  ground: Matter.Bodies.rectangle(
    levelWidth / 2,
    levelHeight * 1.75,
    levelWidth,
    levelHeight * 1.75,
    { isStatic: true }
  ),
  wallL: Matter.Bodies.rectangle(
    -levelWidth,
    (levelHeight + styles.levelNavHeight) / 2,
    levelWidth * 2,
    levelHeight + styles.levelNavHeight,
    { isStatic: true }
  ),
  wallR: Matter.Bodies.rectangle(
    levelWidth * 2,
    (levelHeight + styles.levelNavHeight) / 2,
    levelWidth * 2,
    levelHeight + styles.levelNavHeight,
    { isStatic: true }
  ),
});

// export const Cloud = styled(Animated.Image).attrs({
//   source: require('assets/images/cloud.png')
// })`
//   position: absolute;
//   top: 0px;
//   left: 0px;
//   width: ${levelWidth}px;
//   height: ${levelWidth * 500 / 1171}px;
// `;

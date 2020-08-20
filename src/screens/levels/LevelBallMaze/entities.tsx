import React, { FunctionComponent } from 'react';
import { View } from 'react-native';

import styles from 'assets/styles';
import colors from 'assets/colors';
import getDimensions, { getLevelDimensions } from 'utils/getDimensions';
import Coin from 'components/Coin';

const { width: windowWidth, height: windowHeight } = getDimensions();
const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const { coinSize } = styles;
const coinRadius = coinSize / 2;
const mazeDim = 8;
const cellSize = coinSize;
const wallWidth = cellSize / (mazeDim - 1);
const mazeSize = levelWidth;

const mazePadding = {
  x: (levelWidth - mazeSize) / 2,
  y: styles.levelNavHeight + (levelHeight - mazeSize) / 2
};

export interface BodyRendererProps {
  body: Matter.Body;
  renderer: FunctionComponent<BodyRendererProps>;
}

export interface BodiesRendererProps {
  bodies: Array<Matter.Body>;
  renderer: FunctionComponent<BodiesRendererProps>;
}

export interface CoinInfo {
  body: Matter.Body;
  disabled: boolean;
  found: boolean;
}

export interface CoinsRendererProps {
  coins: Array<CoinInfo>;
  renderer: FunctionComponent<CoinsRendererProps>;
}

export const MazeRenderer: FunctionComponent = () => (
  <View style={{
    position: 'absolute',
    top: mazePadding.y,
    left: mazePadding.x,
    width: windowWidth,
    height: windowWidth,
    backgroundColor: colors.lightWood,
  }}/>
);

export const WallsRenderer: FunctionComponent<BodiesRendererProps> = (props) => {
  const { bodies } = props;
  
  return (
    <>
      {bodies.map(({ bounds }, index) => (
        <View key={String(index)} style={{
          position: 'absolute',
          top: bounds.min.y,
          left: bounds.min.x,
          height: bounds.max.y - bounds.min.y,
          width: bounds.max.x - bounds.min.x,
          backgroundColor: 'black',
        }} />
      ))}
    </>
  );
};

export const HoleRenderer: FunctionComponent<BodyRendererProps> = (props) => {
  const { body } = props;
  const { x, y } = body.position;
  
  return (
    <>
      <View style={{
        position: 'absolute',
        top: y - coinSize,
        left: x - coinSize,
        width: coinSize * 2,
        height: coinSize * 2,
        borderRadius: coinSize,
        backgroundColor: colors.background,
        opacity: 0.5,
        zIndex: 1,
      }} />
      <View style={{
        position: 'absolute',
        top: y - coinSize,
        left: x - coinSize,
        width: coinSize * 2,
        height: coinSize * 2,
        borderRadius: coinSize,
        backgroundColor: colors.background,
      }} />
    </>
  );
};

export const CoinsRenderer: FunctionComponent<CoinsRendererProps> = (props) => {
  const { coins } = props;
  
  return (
    <>
      {coins.map(({ body, disabled, found }, index) => (
        <View key={String(index)} style={{
          position: 'absolute',
          top: body.position.y - coinSize / 2,
          left: body.position.x - coinSize / 2,
          width: coinSize,
          height: coinSize,
          zIndex: disabled ? 0 : 2,
        }}>
          <Coin disabled={disabled} found={found} />
        </View>
      ))}
    </>
  );
};

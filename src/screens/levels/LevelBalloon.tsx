// TODO: IDEA: All the coins are in helium balloons, and you need to press/hold the screen to get them to rise
// Rising will cause the balloons to reach a certain point on the screen, where they'll pop
// TODO: Keep entities even if the app goes out of focus
// TODO: Add types
// IDEA: MaterialCommunityIcons balloon

import React, { useMemo, useRef, useState, useEffect, FunctionComponent } from 'react';
import { Alert, Animated, Button, Easing, PanResponder, View } from 'react-native';
import styled from 'styled-components/native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';

import { Level } from 'utils/interfaces';
import getLevelDimensions from 'utils/getDimensions';
import coinPositions from 'utils/coinPositions';
import styles from 'assets/styles';
import LevelContainer from 'components/LevelContainer';
import Coin, { CoinProps } from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import Physics from './components/LevelBalloon/Physics';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const coinSize = styles.coinSize;

interface CoinViewProps extends CoinProps {
  body: Matter.Body;
}

const CoinView: FunctionComponent<CoinViewProps> = (props) => {
  const { body, ...coinProps } = props;
  const { x, y } = body.position;
  return (
    <View style={{
      position: 'absolute',
      top: y - coinSize,
      left: x - coinSize / 2,
      // backgroundColor: 'red'
    }}>
      <Coin {...coinProps} />
    </View>
  );
};

const Floor = (props) => (
  <View style={{
    position: 'absolute',
    top: levelHeight,
    left: 0
  }}/>
);

const Cloud = styled(Animated.Image).attrs({
  source: require('assets/images/cloud.png')
})`
  position: absolute;
  top: 0px;
  left: 0px;
  width: ${levelWidth}px;
  height: ${levelWidth * 500 / 1171}px;
`;

const initWorld = () => {
  const engine = Matter.Engine.create();
  const world = engine.world;
  world.gravity.y = 1 / 12;
  const coin = Matter.Bodies.rectangle(levelWidth / 2, levelHeight / 2, coinSize, coinSize, { mass: 1 });
  const floor = Matter.Bodies.rectangle(levelWidth / 2, levelHeight + 72 - coinSize / 2, levelWidth, 144, { isStatic: true });
  Matter.World.add(world, [coin, floor]);
  return ({
    physics: {
      engine,
      world
    },
    coin: {
      body: coin,
      onPress: () => Alert.alert('Hey, you donkey', `This level ain't complete yet. Try some other ones!`),
      renderer: CoinView
    },
    floor: {
      body: floor,
      renderer: Floor
    }
  });
};

const LevelBalloon: Level = (props) => {
  const [beingTouched, setBeingTouched] = useState(false);
  const [cloudAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(cloudAnim, {
        toValue: -levelWidth,
        easing: Easing.linear,
        duration: 24000
      })
    ).start();
  }, []);

  const gameEngine = useRef<GameEngine | null>(null);
  const world = useMemo(initWorld, []);
  const entities = useRef(world);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const handleEvent = (e: any) => {
    if (e.type === 'touch-started') setBeingTouched(true);
    else if (e.type === 'touch-ended') setBeingTouched(false);
  }

  return (
    <LevelContainer gradientColors={['#0080ff', 'cyan']}>
      <Cloud style={{transform: [{translateX: cloudAnim}]}} />
      <Cloud style={{transform: [{translateX: Animated.add(cloudAnim, levelWidth)}]}} />
      <GameEngine
        ref={ref => gameEngine.current = ref}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: levelWidth,
          height: levelHeight,
          // backgroundColor: beingTouched ? 'pink' : 'transparent'
        }}
        entities={entities.current}
        systems={[Physics]}
        onEvent={handleEvent}
      />
    </LevelContainer>
  );
};

export default LevelBalloon;

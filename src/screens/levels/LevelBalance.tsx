import React, { useMemo } from 'react';
import { View } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';



const initEntities = () => {
  const engine = Matter.Engine.create();
  const { world } = engine;

  return ({
    physics: {
      engine,
      world,
    },
  });
};

const LevelBalance: Level = (props) => {

  

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const entities = useMemo(() => {
    return {};
  }, []);

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <LevelText hidden={twelve}>twelve</LevelText>
      {coinPositions.map((coinPosition, index: number) => (
        <View
          key={String(index)}
          style={{position: 'absolute', ...coinPosition}}
        >
          <Coin
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
          />
        </View>
      ))}
      <GameEngine
        entities={entities}
      />
    </LevelContainer>
  );
};

export default LevelBalance;

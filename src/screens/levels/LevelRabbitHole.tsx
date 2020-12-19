import React, { useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { ScrollView } from 'react-native-gesture-handler';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import { getLevelDimensions } from 'utils/getDimensions';
import colors from 'res/colors';
import ScreenContainer from 'components/ScreenContainer';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import ScavengerText from 'components/ScavengerText';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const UnitContainer = styled.View`
  width: ${levelWidth}px;
  height: ${levelHeight}px;
`;

const scrollContainerStyle = {
  width: levelWidth,
  height: levelHeight * 4
};

const LevelRabbitHole: Level = (props) => {
  
  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  return (
    <ScreenContainer color={'black'}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        decelerationRate={1}
        contentContainerStyle={scrollContainerStyle}
      >
        <UnitContainer>
          <LevelContainer>
            <LevelText hidden={twelve}>
              Down the rabb<ScavengerText>i</ScavengerText>t hole
            </LevelText>
          </LevelContainer>
        </UnitContainer>
        <ScreenContainer gradientColors={[colors.background, 'black']} />
        <UnitContainer>
          <LevelCounter count={numCoinsFound} />
          {coinPositions.map((coinPosition, index) => (
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
        </UnitContainer>
      </ScrollView>
    </ScreenContainer>
  );
};

export default LevelRabbitHole;

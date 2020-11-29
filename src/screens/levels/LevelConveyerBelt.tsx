import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'res/styles';
import colors from 'res/colors';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import { navIconSize, SettingsIcon } from 'components/LevelNav/components'

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const Row = styled.View`
  flex-direction: row;
  height: ${navIconSize}px;
  overflow: visible;
  background-color: yellow;
  width: 100%;
  justify-content: center;
`;

const SettingsContainer = styled.View`
  width: ${navIconSize * 2}px;
  height: ${navIconSize}px;
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: red;
  overflow: visible;
`;

// TODO: See if there is a fix to this bug with styled-components
// @ts-ignore
const Gear = styled(SettingsIcon)`
  background-color: gray;
  position: absolute;
`;

const LevelConveyerBelt: Level = (props) => {

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <LevelText hidden={twelve}>twelve</LevelText>
      <Row>
        <SettingsContainer>
          <Gear />
        </SettingsContainer>
      </Row>
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
    </LevelContainer>
  );
};

export default LevelConveyerBelt;

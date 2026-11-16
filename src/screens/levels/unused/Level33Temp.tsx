import React from 'react';
import { View } from 'react-native';

import { Level } from 'utils/interfaces';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import styled from 'styled-components/native';
import styles from 'res/styles';

const StyledText = styled.Text`
  width: 100%;
  text-align: center;
`;

const Level33Temp: Level = (props) => {
  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <LevelText hidden={twelve} fontSize={styles.levelTextSize / 2}>
        Level 33 is broken,{'\n'}
        But we're working on a fix!{'\n'}
        In the meantime, take this token;{'\n'}
        You'll be cruising through real quick.
      </LevelText>
      <View style={{ paddingTop: styles.levelTextSize / 2 }}>
        <Coin
          found={twelve}
          onPress={() =>
            props.setCoinsFound(
              new Set(Array.from(Array(12), (_, index) => index))
            )
          }
        />
      </View>
    </LevelContainer>
  );
};

export default Level33Temp;

// TODO: Add "Restart Level" and possibly "Next Level" to settings modal

import React, { useState } from 'react';
import { View, Switch } from 'react-native';
import styled from 'styled-components/native';
import { Octicons } from '@expo/vector-icons'

import { Level } from 'utils/interfaces';
import styles from 'res/styles';
import colors from 'res/colors';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import SettingsModal from 'components/SettingsModal';
import { SettingsText, SwitchableSetting } from 'components/SettingsModal/components';
import { NavButton, SettingsIcon } from 'components/LevelNav/components'

const SettingsButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.5,
})`
  position: absolute;
  top: 0px;
  left: 0px;
  width: ${styles.levelNavHeight}px;
  height: ${styles.levelNavHeight}px;
  justify-content: center;
  align-items: center;
  z-index: ${styles.levelNavZIndex + 1}px;
  background-color: ${colors.background};
`;

const LevelSettingsWin: Level = (props) => {

  const [isRevealed, setIsRevealed] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const hintText = isRevealed ? 'twelve' : '[OUT OF ORDER]';

  const toggleIsRevealed = () => setIsRevealed(isRevealed => !isRevealed);

  return (
    <>
      <SettingsButton onPress={() => setModalOpened(true)}>
        <SettingsIcon />
      </SettingsButton>
      <SettingsModal
        title={`Level ${props.levelNum}`}
        visible={modalOpened}
        onClose={() => setModalOpened(false)}
      >
        <SwitchableSetting
          value={isRevealed}
          label={'Show coins'}
          onValueChange={toggleIsRevealed}
        />
      </SettingsModal>
      <LevelContainer>
        <LevelText
          hidden={twelve}
          color={isRevealed ? undefined : colors.badCoin}
        >
          {hintText}
        </LevelText>
        {isRevealed && (
          <>
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
          </>
        )}
      </LevelContainer>
    </>
  );
};

export default LevelSettingsWin;

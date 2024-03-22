// TODO: Add "Restart Level" and possibly "Next Level" to settings modal

import React, { FunctionComponent, memo, useState, useCallback } from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import styles from 'res/styles';
import colors from 'res/colors';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import SettingsModal from 'components/SettingsModal';
import {
  SwitchableSetting,
  SwitchableSettingIconProps,
  switchableIconSize,
} from 'components/SettingsModal/components';
import { SettingsIcon } from 'components/LevelNav/components';

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
  z-index: ${styles.levelNavZIndex + 1};
`;

const RevealIcon: FunctionComponent<SwitchableSettingIconProps> = memo(
  (props) => {
    const { disabled, size, color } = props;
    return (
      <MaterialCommunityIcons
        name={disabled ? 'eye-off' : 'eye'}
        size={size || switchableIconSize}
        color={color || colors.lightText}
      />
    );
  }
);

const LevelSettingsWin: Level = (props) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  const hintText = isRevealed ? 'twelve' : '[OUT OF ORDER]';

  const toggleIsRevealed = useCallback(
    () => setIsRevealed((isRevealed) => !isRevealed),
    []
  );
  const handleSettingsClose = useCallback(() => setModalOpened(false), []);
  const handleGoToLevelSelect = useCallback(() => {
    props.navigation.navigate('Level', { level: 0 });
  }, []);
  const handleRestart = useCallback(() => {
    props.navigation.goBack();
    props.navigation.navigate('Level', { level: props.levelNum });
  }, []);
  const handlePrevLevel = useCallback(() => {
    props.navigation.navigate('Level', { level: props.levelNum - 1 });
  }, []);
  const handleNextLevel = useCallback(() => {
    props.navigation.navigate('Level', { level: props.levelNum + 1 });
  }, []);

  return (
    <>
      <SettingsButton onPress={() => setModalOpened(true)}>
        <SettingsIcon />
      </SettingsButton>
      <SettingsModal
        title={`Level ${props.levelNum}`}
        visible={modalOpened}
        onClose={handleSettingsClose}
        onGoToLevelSelect={handleGoToLevelSelect}
        onRestart={handleRestart}
        level={props.levelNum}
        onPrevLevel={handlePrevLevel}
        onNextLevel={handleNextLevel}
      >
        <SwitchableSetting
          value={isRevealed}
          icon={RevealIcon}
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
                style={{ position: 'absolute', ...coinPosition }}
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
